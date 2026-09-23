using System.Collections.Generic;
using UnityEngine;

namespace IcesiRun.Graph
{
    [CreateAssetMenu(fileName = "CampusGraph_Icesi", menuMenuName = "IcesiRun/Campus Graph")]
    public class CampusGraph : ScriptableObject
    {
        public List<CampusNode> nodes = new List<CampusNode>();
        public List<CampusEdge> edges = new List<CampusEdge>();

        private readonly Dictionary<string, CampusNode> _nodeLookup = new Dictionary<string, CampusNode>();
        private readonly Dictionary<string, CampusEdge> _edgeLookup = new Dictionary<string, CampusEdge>();

        public void InitializeLookup()
        {
            _nodeLookup.Clear();
            foreach (var node in nodes)
            {
                if (!_nodeLookup.ContainsKey(node.id))
                    _nodeLookup.Add(node.id, node);
            }

            _edgeLookup.Clear();
            foreach (var edge in edges)
            {
                if (!_edgeLookup.ContainsKey(edge.id))
                    _edgeLookup.Add(edge.id, edge);
            }
        }

        public CampusNode GetNode(string nodeId)
        {
            if (_nodeLookup.Count == 0 && nodes.Count > 0) InitializeLookup();
            _nodeLookup.TryGetValue(nodeId, out var node);
            return node;
        }

        public CampusEdge GetEdge(string edgeId)
        {
            if (_edgeLookup.Count == 0 && edges.Count > 0) InitializeLookup();
            _edgeLookup.TryGetValue(edgeId, out var edge);
            return edge;
        }

        public CampusNode FindClosestNode(Vector2 worldPos, float maxDistance = 10f)
        {
            CampusNode closest = null;
            float minSqrDist = maxDistance * maxDistance;

            foreach (var node in nodes)
            {
                float sqrDist = (node.worldPosition - worldPos).sqrMagnitude;
                if (sqrDist < minSqrDist)
                {
                    minSqrDist = sqrDist;
                    closest = node;
                }
            }

            return closest;
        }

        public List<CampusNode> GetConnectedNeighbors(string nodeId)
        {
            var neighbors = new List<CampusNode>();
            var node = GetNode(nodeId);
            if (node == null) return neighbors;

            foreach (var edgeId in node.connectedEdgeIds)
            {
                var edge = GetEdge(edgeId);
                if (edge != null && !edge.isBlocked)
                {
                    string targetId = edge.GetOppositeNode(nodeId);
                    var targetNode = GetNode(targetId);
                    if (targetNode != null)
                    {
                        neighbors.Add(targetNode);
                    }
                }
            }

            return neighbors;
        }
    }
}
