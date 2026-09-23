using UnityEngine;
using IcesiRun.AI;

namespace IcesiRun.Data
{
    [CreateAssetMenu(fileName = "Enemy_New", menuName = "IcesiRun/Enemy Data")]
    public class EnemyDataSO : ScriptableObject
    {
        public string enemyName;
        public PersonalityType personality;
        public float patrolSpeed = 3.2f;
        public float chaseSpeed = 4.6f;
        public float detectionRadius = 8.0f;
        public Color themeColor = Color.red;
        public Sprite icon;
    }
}
