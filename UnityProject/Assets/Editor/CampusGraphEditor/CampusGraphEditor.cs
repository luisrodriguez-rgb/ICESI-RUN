using UnityEngine;
using UnityEditor;
using IcesiRun.Graph;

namespace IcesiRun.EditorTools
{
    [CustomEditor(typeof(CampusGraph))]
    public class CampusGraphEditor : Editor
    {
        private CampusGraph Graph => (CampusGraph)target;

        public override void OnInspectorGUI()
        {
            DrawDefaultInspector();

            EditorGUILayout.Space(12);
            if (GUILayout.Button("Inicializar Tablas de Búsqueda", GUILayout.Height(30)))
            {
                Graph.InitializeLookup();
                EditorUtility.SetDirty(Graph);
            }
        }

        private void OnSceneGUI()
        {
            if (Graph == null || Graph.nodes == null) return;

            // Dibujar aristas entre nodos
            Handles.color = new Color(0.2f, 0.7f, 1f, 0.7f);
            foreach (var edge in Graph.edges)
            {
                var nodeA = Graph.GetNode(edge.nodeAId);
                var nodeB = Graph.GetNode(edge.nodeBId);

                if (nodeA != null && nodeB != null)
                {
                    Handles.DrawLine(nodeA.worldPosition, nodeB.worldPosition, edge.corridorWidth);
                }
            }

            // Dibujar y manipular nodos en la escena
            foreach (var node in Graph.nodes)
            {
                Handles.color = node.nodeType == NodeType.PortalExit ? Color.green :
                                node.nodeType == NodeType.SpawnPoint ? Color.yellow :
                                new Color(1f, 0.4f, 0f, 0.9f);

                Vector3 currentPos = new Vector3(node.worldPosition.x, node.worldPosition.y, 0f);
                EditorGUI.BeginChangeCheck();
                Vector3 newPos = Handles.FreeMoveHandle(
                    currentPos,
                    0.4f,
                    Vector3.zero,
                    Handles.SphereHandleCap
                );

                if (EditorGUI.EndChangeCheck())
                {
                    Undo.RecordObject(Graph, "Mover Nodo de Campus");
                    node.worldPosition = new Vector2(newPos.x, newPos.y);
                    EditorUtility.SetDirty(Graph);
                }

                Handles.Label(currentPos + Vector3.up * 0.5f, node.id);
            }
        }
    }
}
