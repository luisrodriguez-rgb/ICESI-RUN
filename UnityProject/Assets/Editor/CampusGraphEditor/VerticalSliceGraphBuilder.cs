using System.IO;
using UnityEngine;
using UnityEditor;
using IcesiRun.Graph;
using IcesiRun.Data;
using IcesiRun.AI;

namespace IcesiRun.EditorTools
{
    public static class VerticalSliceGraphBuilder
    {
        private const string DataPath = "Assets/_Project/Data";

        [MenuItem("IcesiRun/Build Vertical Slice Assets", false, 1)]
        public static void BuildAllVerticalSliceAssets()
        {
            EnsureDirectories();
            BuildCampusZones();
            BuildMissionItems();
            BuildEnemyData();
            BuildGraphAsset();

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            Debug.Log("<color=#38BDF8><b>[ICESI RUN]</b></color> ¡Todos los assets del Vertical Slice fueron generados con éxito!");
        }

        private static void EnsureDirectories()
        {
            if (!Directory.Exists(DataPath)) Directory.CreateDirectory(DataPath);
            if (!Directory.Exists($"{DataPath}/Zones")) Directory.CreateDirectory($"{DataPath}/Zones");
            if (!Directory.Exists($"{DataPath}/Missions")) Directory.CreateDirectory($"{DataPath}/Missions");
            if (!Directory.Exists($"{DataPath}/Enemies")) Directory.CreateDirectory($"{DataPath}/Enemies");
        }

        private static void BuildCampusZones()
        {
            CreateOrUpdateZone("Zone_NorthGate", "north_gate", "Portería 1 — Avenida Cañasgordas",
                "Entrada principal al norte del campus de Icesi sobre la Av. Cañasgordas.", 0.1f, true, new Color(0.2f, 0.5f, 0.9f));

            CreateOrUpdateZone("Zone_EdificioA", "edificio_a", "Edificio A — Tecnoquímicas",
                "Aulas de ingeniería, laboratorios y pasillos de ladrillo a la vista.", 0.6f, false, new Color(0.7f, 0.35f, 0.2f));

            CreateOrUpdateZone("Zone_PlazaSaman", "plaza_saman", "Plaza del Samán",
                "El gran árbol central de Icesi, punto de sombra, descanso e iguanas.", 0.3f, false, new Color(0.2f, 0.6f, 0.3f));

            CreateOrUpdateZone("Zone_Biblioteca", "biblioteca", "Biblioteca Carvajal",
                "Centro del saber, reserva de libros y zona de estudio silencioso.", 0.2f, true, new Color(0.2f, 0.7f, 0.9f));
        }

        private static void CreateOrUpdateZone(string assetName, string id, string displayName, string lore, float danger, bool isSafe, Color tint)
        {
            string path = $"{DataPath}/Zones/{assetName}.asset";
            var zone = AssetDatabase.LoadAssetAtPath<CampusZoneSO>(path);
            if (zone == null)
            {
                zone = ScriptableObject.CreateInstance<CampusZoneSO>();
                AssetDatabase.CreateAsset(zone, path);
            }

            zone.zoneId = id;
            zone.displayName = displayName;
            zone.loreDescription = lore;
            zone.dangerLevel = danger;
            zone.isSafeZone = isSafe;
            zone.zoneTint = tint;
            EditorUtility.SetDirty(zone);
        }

        private static void BuildMissionItems()
        {
            CreateOrUpdateItem("Item_LibroReserva", "book_reserva", "Libro de Reserva",
                MissionItemType.KeyObjective, 250, 0f, new Color(0.2f, 0.75f, 1f));

            CreateOrUpdateItem("Item_CafeShillers", "cafe_shillers", "Café de Shillers",
                MissionItemType.PowerUp, 150, 8.0f, new Color(1f, 0.45f, 0f));
        }

        private static void CreateOrUpdateItem(string assetName, string id, string displayName, MissionItemType type, int score, float duration, Color glow)
        {
            string path = $"{DataPath}/Missions/{assetName}.asset";
            var item = AssetDatabase.LoadAssetAtPath<MissionItemSO>(path);
            if (item == null)
            {
                item = ScriptableObject.CreateInstance<MissionItemSO>();
                AssetDatabase.CreateAsset(item, path);
            }

            item.itemId = id;
            item.itemName = displayName;
            item.itemType = type;
            item.scoreValue = score;
            item.powerUpDuration = duration;
            item.glowColor = glow;
            EditorUtility.SetDirty(item);
        }

        private static void BuildEnemyData()
        {
            CreateOrUpdateEnemy("Enemy_Vigilante", "El Vigilante en Carrito",
                PersonalityType.LoopPatrol, 3.2f, 4.4f, 8.0f, new Color(0.98f, 0.8f, 0.1f));

            CreateOrUpdateEnemy("Enemy_Monitor", "El Monitor Académico",
                PersonalityType.DirectChase, 3.0f, 4.8f, 9.0f, new Color(0.9f, 0.2f, 0.2f));
        }

        private static void CreateOrUpdateEnemy(string assetName, string displayName, PersonalityType personality, float patrolSpd, float chaseSpd, float detectRadius, Color theme)
        {
            string path = $"{DataPath}/Enemies/{assetName}.asset";
            var enemy = AssetDatabase.LoadAssetAtPath<EnemyDataSO>(path);
            if (enemy == null)
            {
                enemy = ScriptableObject.CreateInstance<EnemyDataSO>();
                AssetDatabase.CreateAsset(enemy, path);
            }

            enemy.enemyName = displayName;
            enemy.personality = personality;
            enemy.patrolSpeed = patrolSpd;
            enemy.chaseSpeed = chaseSpd;
            enemy.detectionRadius = detectRadius;
            enemy.themeColor = theme;
            EditorUtility.SetDirty(enemy);
        }

        private static void BuildGraphAsset()
        {
            string path = $"{DataPath}/CampusGraph_VerticalSlice.asset";
            var graph = AssetDatabase.LoadAssetAtPath<CampusGraph>(path);
            if (graph == null)
            {
                graph = ScriptableObject.CreateInstance<CampusGraph>();
                AssetDatabase.CreateAsset(graph, path);
            }

            graph.nodes.Clear();
            graph.edges.Clear();

            // Nodos del Vertical Slice
            AddNode(graph, "node_p1_gate", new Vector2(0f, 18f), "north_gate", NodeType.SpawnPoint);
            AddNode(graph, "node_bulevar_n1", new Vector2(0f, 14f), "bulevar_norte", NodeType.Intersection);
            AddNode(graph, "node_edif_a_nw", new Vector2(6f, 14f), "edificio_a", NodeType.Corner);
            AddNode(graph, "node_edif_a_ne", new Vector2(14f, 14f), "edificio_a", NodeType.Corner);
            AddNode(graph, "node_edif_a_se", new Vector2(14f, 8f), "edificio_a", NodeType.Corner);
            AddNode(graph, "node_edif_a_sw", new Vector2(6f, 8f), "edificio_a", NodeType.Intersection);
            AddNode(graph, "node_saman_north", new Vector2(0f, 8f), "plaza_saman", NodeType.Intersection);
            AddNode(graph, "node_saman_center", new Vector2(0f, 4f), "plaza_saman", NodeType.Intersection);
            AddNode(graph, "node_saman_east", new Vector2(6f, 4f), "plaza_saman", NodeType.Intersection);
            AddNode(graph, "node_lib_north", new Vector2(0f, 0f), "biblioteca", NodeType.Intersection);
            AddNode(graph, "node_lib_center", new Vector2(0f, -4f), "biblioteca", NodeType.Intersection);
            AddNode(graph, "node_lib_east", new Vector2(6f, -4f), "biblioteca", NodeType.Intersection);
            AddNode(graph, "node_exit_slice", new Vector2(10f, -4f), "biblioteca", NodeType.PortalExit);

            // Aristas y Corredores
            AddEdge(graph, "edge_p1_bulevar", "node_p1_gate", "node_bulevar_n1", 4.0f);
            AddEdge(graph, "edge_bulevar_edif_a", "node_bulevar_n1", "node_edif_a_nw", 3.0f);
            AddEdge(graph, "edge_bulevar_saman_n", "node_bulevar_n1", "node_saman_north", 3.5f);
            AddEdge(graph, "edge_edif_a_north", "node_edif_a_nw", "node_edif_a_ne", 2.5f);
            AddEdge(graph, "edge_edif_a_east", "node_edif_a_ne", "node_edif_a_se", 2.5f);
            AddEdge(graph, "edge_edif_a_south", "node_edif_a_se", "node_edif_a_sw", 2.5f);
            AddEdge(graph, "edge_edif_a_west", "node_edif_a_sw", "node_edif_a_nw", 2.5f);
            AddEdge(graph, "edge_saman_n_a_sw", "node_saman_north", "node_edif_a_sw", 2.8f);
            AddEdge(graph, "edge_saman_corridor", "node_saman_north", "node_saman_center", 4.0f);
            AddEdge(graph, "edge_saman_east", "node_saman_center", "node_saman_east", 3.0f);
            AddEdge(graph, "edge_saman_east_a", "node_saman_east", "node_edif_a_sw", 2.5f);
            AddEdge(graph, "edge_saman_lib", "node_saman_center", "node_lib_north", 3.5f);
            AddEdge(graph, "edge_saman_east_lib", "node_saman_east", "node_lib_east", 2.5f);
            AddEdge(graph, "edge_lib_entrance", "node_lib_north", "node_lib_center", 3.0f);
            AddEdge(graph, "edge_lib_hall", "node_lib_center", "node_lib_east", 2.5f);
            AddEdge(graph, "edge_lib_to_exit", "node_lib_east", "node_exit_slice", 3.0f);

            graph.InitializeLookup();
            EditorUtility.SetDirty(graph);
        }

        private static void AddNode(CampusGraph graph, string id, Vector2 pos, string zoneId, NodeType type)
        {
            var node = new CampusNode(id, pos, zoneId, type);
            graph.nodes.Add(node);
        }

        private static void AddEdge(CampusGraph graph, string id, string nodeA, string nodeB, float width)
        {
            var edge = new CampusEdge(id, nodeA, nodeB, width);
            graph.edges.Add(edge);

            // Conectar id a los nodos
            var nA = graph.nodes.Find(n => n.id == nodeA);
            var nB = graph.nodes.Find(n => n.id == nodeB);
            if (nA != null && !nA.connectedEdgeIds.Contains(id)) nA.connectedEdgeIds.Add(id);
            if (nB != null && !nB.connectedEdgeIds.Contains(id)) nB.connectedEdgeIds.Add(id);
        }
    }
}
