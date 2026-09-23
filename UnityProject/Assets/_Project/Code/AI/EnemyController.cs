using System.Collections.Generic;
using UnityEngine;
using IcesiRun.Graph;

namespace IcesiRun.AI
{
    public enum PersonalityType
    {
        DirectChase,        // El Monitor: Minimiza distancia euclidiana directa
        PredictiveIntercept,// La Entrega: Proyecta posición futura del jugador
        LoopPatrol,         // El Vigilante: Recorre circuito cerrado predecible
        ChaoticFlanker      // El Caos / La Iguana: Comportamiento territorial y estocástico
    }

    public enum EnemyState
    {
        Patrol,
        Detect,
        Chase,
        Intercept,
        LosePlayer,
        Return,
        Frightened
    }

    public class EnemyController : MonoBehaviour
    {
        [Header("Configuración y Grafo")]
        [SerializeField] private PersonalityType personality = PersonalityType.DirectChase;
        [SerializeField] private CampusGraph campusGraph;
        [SerializeField] private float patrolSpeed = 3.2f;
        [SerializeField] private float chaseSpeed = 4.6f;
        [SerializeField] private float detectionRadius = 8.0f;

        [Header("Patrullaje")]
        [SerializeField] private List<string> patrolNodeIds = new List<string>();

        private EnemyState _state = EnemyState.Patrol;
        private CampusNode _currentNode;
        private CampusNode _targetNode;
        private CampusNode _playerCurrentNode;
        private Vector2 _playerVelocity;
        private int _patrolIndex = 0;
        private float _stateTimer = 0f;
        private float _tProgress = 0f;

        public EnemyState CurrentState => _state;
        public PersonalityType Personality => personality;

        public void Initialize(CampusNode startNode)
        {
            _currentNode = startNode;
            _targetNode = null;
            transform.position = startNode.worldPosition;
            _state = EnemyState.Patrol;
        }

        public void UpdatePerception(CampusNode playerNode, Vector2 playerVel)
        {
            _playerCurrentNode = playerNode;
            _playerVelocity = playerVel;

            float distToPlayer = Vector2.Distance(transform.position, playerNode != null ? playerNode.worldPosition : Vector2.zero);

            // Transición a DETECT si el jugador entra en radio
            if (_state == EnemyState.Patrol && distToPlayer <= detectionRadius)
            {
                _state = EnemyState.Detect;
                _stateTimer = 0.35f; // Pausa dramática de alerta '!'
            }
        }

        private void Update()
        {
            float dt = Time.deltaTime;

            if (_state == EnemyState.Detect)
            {
                _stateTimer -= dt;
                if (_stateTimer <= 0f)
                {
                    _state = personality == PersonalityType.PredictiveIntercept
                        ? EnemyState.Intercept
                        : EnemyState.Chase;
                }
                return;
            }

            if (_targetNode == null)
            {
                // Estamos en un nodo: tomar decisión de cruce
                MakeIntersectionDecision();
            }
            else
            {
                // Mover a lo largo del corredor hacia el nodo destino
                AdvanceAlongCorridor(dt);
            }
        }

        private void AdvanceAlongCorridor(float dt)
        {
            float speed = (_state == EnemyState.Chase || _state == EnemyState.Intercept)
                ? chaseSpeed
                : patrolSpeed;

            Vector2 start = _currentNode.worldPosition;
            Vector2 end = _targetNode.worldPosition;
            float len = Vector2.Distance(start, end);

            if (len <= 0.001f)
            {
                OnArriveAtNode(_targetNode);
                return;
            }

            _tProgress += (speed * dt) / len;
            if (_tProgress >= 1f)
            {
                OnArriveAtNode(_targetNode);
            }
            else
            {
                transform.position = Vector2.Lerp(start, end, _tProgress);
            }
        }

        private void OnArriveAtNode(CampusNode reached)
        {
            _currentNode = reached;
            transform.position = reached.worldPosition;
            _tProgress = 0f;
            _targetNode = null;

            // Tomar decisión algorítmica para el siguiente tramo
            MakeIntersectionDecision();
        }

        /// <summary>
        /// Algoritmo central: toma de decisión ejecutada EXCLUSIVAMENTE en nodos de intersección.
        /// </summary>
        private void MakeIntersectionDecision()
        {
            var neighbors = campusGraph.GetConnectedNeighbors(_currentNode.id);
            if (neighbors.Count == 0) return;

            switch (_state)
            {
                case EnemyState.Patrol:
                    _targetNode = SelectPatrolNeighbor(neighbors);
                    break;

                case EnemyState.Chase:
                    _targetNode = SelectDirectChaseNeighbor(neighbors);
                    break;

                case EnemyState.Intercept:
                    _targetNode = SelectInterceptNeighbor(neighbors);
                    break;

                case EnemyState.Frightened:
                    _targetNode = SelectScatterNeighbor(neighbors);
                    break;

                default:
                    _targetNode = neighbors[Random.Range(0, neighbors.Count)];
                    break;
            }
        }

        private CampusNode SelectPatrolNeighbor(List<CampusNode> neighbors)
        {
            if (patrolNodeIds.Count > 0)
            {
                string targetId = patrolNodeIds[_patrolIndex % patrolNodeIds.Count];
                foreach (var n in neighbors)
                {
                    if (n.id == targetId)
                    {
                        _patrolIndex++;
                        return n;
                    }
                }
            }
            return neighbors[Random.Range(0, neighbors.Count)];
        }

        private CampusNode SelectDirectChaseNeighbor(List<CampusNode> neighbors)
        {
            if (_playerCurrentNode == null) return neighbors[0];

            CampusNode best = null;
            float minDist = float.MaxValue;

            foreach (var n in neighbors)
            {
                float d = Vector2.Distance(n.worldPosition, _playerCurrentNode.worldPosition);
                if (d < minDist)
                {
                    minDist = d;
                    best = n;
                }
            }

            return best ?? neighbors[0];
        }

        private CampusNode SelectInterceptNeighbor(List<CampusNode> neighbors)
        {
            if (_playerCurrentNode == null) return neighbors[0];

            // Proyectar 4 unidades hacia adelante según velocidad del jugador
            Vector2 predictedPos = _playerCurrentNode.worldPosition + (_playerVelocity.normalized * 4.0f);

            CampusNode best = null;
            float minDist = float.MaxValue;

            foreach (var n in neighbors)
            {
                float d = Vector2.Distance(n.worldPosition, predictedPos);
                if (d < minDist)
                {
                    minDist = d;
                    best = n;
                }
            }

            return best ?? neighbors[0];
        }

        private CampusNode SelectScatterNeighbor(List<CampusNode> neighbors)
        {
            if (_playerCurrentNode == null) return neighbors[0];

            CampusNode best = null;
            float maxDist = -1f;

            // Huir en dirección opuesta al jugador
            foreach (var n in neighbors)
            {
                float d = Vector2.Distance(n.worldPosition, _playerCurrentNode.worldPosition);
                if (d > maxDist)
                {
                    maxDist = d;
                    best = n;
                }
            }

            return best ?? neighbors[0];
        }
    }
}
