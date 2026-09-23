using UnityEngine;

namespace IcesiRun.Data
{
    public enum MissionItemType
    {
        KeyObjective,   // Libro, Proyecto, Balón
        PowerUp,        // Café de Shillers
        CollectCredit   // Crédito académico
    }

    [CreateAssetMenu(fileName = "MissionItem_New", menuName = "IcesiRun/Mission Item")]
    public class MissionItemSO : ScriptableObject
    {
        public string itemId;
        public string itemName;
        public MissionItemType itemType = MissionItemType.KeyObjective;
        public int scoreValue = 250;
        public float powerUpDuration = 8.0f;
        public Sprite icon;
        public Color glowColor = Color.cyan;
    }
}
