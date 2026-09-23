using System;
using System.Collections.Generic;
using UnityEngine;

namespace IcesiRun.Graph
{
    public enum NodeType
    {
        Intersection,
        Corner,
        DeadEnd,
        SpawnPoint,
        PortalExit
    }

    [Serializable]
    public class CampusNode
    {
        public string id;
        public Vector2 worldPosition;
        public string zoneId;
        public NodeType nodeType = NodeType.Intersection;
        public List<string> connectedEdgeIds = new List<string>();

        public CampusNode(string id, Vector2 position, string zoneId, NodeType type = NodeType.Intersection)
        {
            this.id = id;
            this.worldPosition = position;
            this.zoneId = zoneId;
            this.nodeType = type;
        }
    }

    [Serializable]
    public class CampusEdge
    {
        public string id;
        public string nodeAId;
        public string nodeBId;
        public float corridorWidth = 2.5f; // Ancho en metros
        public float speedMultiplier = 1.0f;
        public bool isBlocked = false;

        public CampusEdge(string id, string nodeA, string nodeB, float width = 2.5f)
        {
            this.id = id;
            this.nodeAId = nodeA;
            this.nodeBId = nodeB;
            this.corridorWidth = width;
        }

        public string GetOppositeNode(string currentNodeId)
        {
            return currentNodeId == nodeAId ? nodeBId : nodeAId;
        }
    }
}
