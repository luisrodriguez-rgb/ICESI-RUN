using UnityEngine;

namespace IcesiRun.Data
{
    [CreateAssetMenu(fileName = "Zone_New", menuName = "IcesiRun/Campus Zone")]
    public class CampusZoneSO : ScriptableObject
    {
        public string zoneId;
        public string displayName;
        [TextArea(2, 4)]
        public string loreDescription;

        [Range(0f, 1f)]
        public float dangerLevel = 0.2f;

        public bool isSafeZone = false;
        public Color zoneTint = Color.white;
        public AudioClip ambientAudio;
        public string lightingProfileName = "default_outdoor";
    }
}
