using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using IcesiRun.Graph;

namespace IcesiRun.EditorTools
{
    public class MapValidator : EditorWindow
    {
        private CampusGraph _targetGraph;
        private Vector2 _scrollPos;
        private List<string> _validationLogs = new List<string>();

        [MenuItem("IcesiRun/Map Validator")]
        public static void ShowWindow()
        {
            GetWindow<MapValidator>("Campus Map Validator");
        }

        private void OnGUI()
        {
            GUILayout.Label("Validación Estática del Grafo de Icesi", EditorStyles.boldLabel);
            _targetGraph = (CampusGraph)EditorGUILayout.ObjectField("Grafo del Campus", _targetGraph, typeof(CampusGraph), false);

            if (_targetGraph == null)
            {
                EditorGUILayout.HelpBox("Asigna un asset de CampusGraph para ejecutar la validación.", MessageType.Info);
                return;
            }

            if (GUILayout.Button("Ejecutar Validación Completa", GUILayout.Height(32)))
            {
                RunValidation();
            }

            EditorGUILayout.Space(10);
            _scrollPos = EditorGUILayout.BeginScrollView(_scrollPos);
            foreach (var log in _validationLogs)
            {
                if (log.StartsWith("ERROR"))
                    EditorGUILayout.HelpBox(log, MessageType.Error);
                else if (log.StartsWith("WARN"))
                    EditorGUILayout.HelpBox(log, MessageType.Warning);
                else
                    EditorGUILayout.HelpBox(log, MessageType.None);
            }
            EditorGUILayout.EndScrollView();
        }

        private void RunValidation()
        {
            _validationLogs.Clear();
            _targetGraph.InitializeLookup();

            int orphanNodes = 0;
            int narrowCorridors = 0;

            // 1. Validar nodos huérfanos
            foreach (var node in _targetGraph.nodes)
            {
                var neighbors = _targetGraph.GetConnectedNeighbors(node.id);
                if (neighbors.Count == 0)
                {
                    _validationLogs.Add($"ERROR: Nodo huérfano detectado '{node.id}' en ({node.worldPosition.x}, {node.worldPosition.y}). Sin conexiones.");
                    orphanNodes++;
                }
            }

            // 2. Validar aristas y anchos de corredor
            foreach (var edge in _targetGraph.edges)
            {
                if (edge.corridorWidth < 1.5f)
                {
                    _validationLogs.Add($"WARN: Arista '{edge.id}' tiene un ancho estrecho ({edge.corridorWidth}m < 1.5m). Podría dificultar la navegación.");
                    narrowCorridors++;
                }
            }

            if (orphanNodes == 0)
            {
                _validationLogs.Add("✓ OK: Todos los nodos están conectados al grafo de circulación.");
            }

            _validationLogs.Add($"✓ Resumen: {_targetGraph.nodes.Count} nodos analizados, {_targetGraph.edges.Count} aristas verificadas.");
        }
    }
}
