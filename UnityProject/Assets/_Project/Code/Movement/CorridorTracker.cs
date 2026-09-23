using UnityEngine;
using IcesiRun.Graph;

namespace IcesiRun.Movement
{
    /// <summary>
    /// Gestiona la navegación continua en corredores con transiciones discretas en nodos de intersección.
    /// </summary>
    public class CorridorTracker : MonoBehaviour
    {
        [Header("Referencias de Grafo")]
        [SerializeField] private CampusGraph campusGraph;

        [Header("Configuración de Movimiento")]
        [SerializeField] private float baseSpeed = 4.5f; // m/s
        [SerializeField] private float sprintMultiplier = 1.55f;
        [SerializeField] private float bufferFactor = 0.15f;

        private CampusNode _currentNode;
        private CampusNode _targetNode;
        private CampusEdge _currentEdge;
        private float _tProgress = 0f; // [0, 1] a lo largo de la arista
        private float _currentSpeed;

        private readonly CornerBuffer _cornerBuffer = new CornerBuffer();
        private Vector2 _currentMoveDirection = Vector2.zero;
        private bool _isSprintActive = false;

        public Vector2 WorldPosition => transform.position;
        public Vector2 MoveDirection => _currentMoveDirection;
        public bool IsMoving => _currentMoveDirection != Vector2.zero;

        private void Awake()
        {
            _currentSpeed = baseSpeed;
        }

        public void InitializeAtNode(CampusNode startNode)
        {
            _currentNode = startNode;
            _targetNode = null;
            _currentEdge = null;
            transform.position = startNode.worldPosition;
        }

        public void SetSprint(bool active)
        {
            _isSprintActive = active;
            _currentSpeed = active ? baseSpeed * sprintMultiplier : baseSpeed;
        }

        public void ProcessMovementInput(Vector2 rawInput)
        {
            _cornerBuffer.RegisterInput(rawInput);
        }

        private void Update()
        {
            _cornerBuffer.Update(Time.deltaTime);

            if (_targetNode == null)
            {
                // Estamos detenidos en un nodo, intentar iniciar movimiento hacia un vecino válido
                EvaluateTurnAtNode(_currentNode);
            }
            else
            {
                // Nos desplazamos a lo largo de la arista actual hacia _targetNode
                AdvanceAlongCorridor(Time.deltaTime);
            }
        }

        private void AdvanceAlongCorridor(float dt)
        {
            Vector2 startPos = _currentNode.worldPosition;
            Vector2 endPos = _targetNode.worldPosition;
            float edgeLength = Vector2.Distance(startPos, endPos);

            if (edgeLength <= 0.001f)
            {
                ArriveAtNode(_targetNode);
                return;
            }

            float step = (_currentSpeed * dt) / edgeLength;
            _tProgress += step;

            // Comprobar ventana de snapping al aproximarse al nodo destino
            float distToTarget = (1f - _tProgress) * edgeLength;
            float corridorWidth = _currentEdge != null ? _currentEdge.corridorWidth : 2.5f;
            float snapWindow = CornerBuffer.CalculateSnapWindow(corridorWidth, _currentSpeed, bufferFactor);

            if (distToTarget <= snapWindow && _cornerBuffer.HasBufferedInput)
            {
                // Anticipar giro hacia la nueva dirección
                TryQueueBranchAtNode(_targetNode, _cornerBuffer.BufferedInput);
            }

            if (_tProgress >= 1f)
            {
                ArriveAtNode(_targetNode);
            }
            else
            {
                transform.position = Vector2.Lerp(startPos, endPos, _tProgress);
            }
        }

        private void ArriveAtNode(CampusNode reachedNode)
        {
            _currentNode = reachedNode;
            transform.position = reachedNode.worldPosition;
            _tProgress = 0f;

            // Evaluar giro o continuación en el nuevo nodo
            if (!EvaluateTurnAtNode(_currentNode))
            {
                _targetNode = null;
                _currentEdge = null;
                _currentMoveDirection = Vector2.zero;
            }
        }

        private bool EvaluateTurnAtNode(CampusNode node)
        {
            Vector2 desiredDir = _cornerBuffer.HasBufferedInput ? _cornerBuffer.BufferedInput : _currentMoveDirection;
            if (desiredDir == Vector2.zero) return false;

            var neighbors = campusGraph.GetConnectedNeighbors(node.id);
            foreach (var neighbor in neighbors)
            {
                Vector2 dirToNeighbor = (neighbor.worldPosition - node.worldPosition).normalized;
                if (Vector2.Dot(desiredDir, dirToNeighbor) > 0.7f) // Dirección alineada
                {
                    _targetNode = neighbor;
                    _currentMoveDirection = dirToNeighbor;
                    _cornerBuffer.ConsumeInput();
                    return true;
                }
            }

            return false;
        }

        private void TryQueueBranchAtNode(CampusNode nextNode, Vector2 desiredDir)
        {
            var neighbors = campusGraph.GetConnectedNeighbors(nextNode.id);
            foreach (var neighbor in neighbors)
            {
                if (neighbor.id == _currentNode.id) continue; // No regresar por donde venimos

                Vector2 dirToNeighbor = (neighbor.worldPosition - nextNode.worldPosition).normalized;
                if (Vector2.Dot(desiredDir, dirToNeighbor) > 0.7f)
                {
                    // Giro válido confirmado para ejecutarse al cruzar nextNode
                    return;
                }
            }
        }
    }
}
