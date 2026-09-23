using UnityEngine;

namespace IcesiRun.Movement
{
    /// <summary>
    /// Gestiona la ventana dinámica de Corner-Buffering para giros asistidos en corredores arcade.
    /// Emula la respuesta milimétrica de Pac-Man Championship Edition.
    /// </summary>
    public class CornerBuffer
    {
        private Vector2 _bufferedInput;
        private float _bufferTimer;
        private const float DefaultBufferDuration = 0.22f; // ~13 fotogramas a 60 FPS

        public Vector2 BufferedInput => _bufferedInput;
        public bool HasBufferedInput => _bufferTimer > 0f && _bufferedInput != Vector2.zero;

        public void RegisterInput(Vector2 input)
        {
            if (input.sqrMagnitude > 0.1f)
            {
                // Cuantizar a las 4 direcciones cardinales puras de corredor
                _bufferedInput = QuantizeToCardinal(input);
                _bufferTimer = DefaultBufferDuration;
            }
        }

        public void Update(float deltaTime)
        {
            if (_bufferTimer > 0f)
            {
                _bufferTimer -= deltaTime;
                if (_bufferTimer <= 0f)
                {
                    _bufferedInput = Vector2.zero;
                }
            }
        }

        public void ConsumeInput()
        {
            _bufferedInput = Vector2.zero;
            _bufferTimer = 0f;
        }

        /// <summary>
        /// Calcula la ventana dinámica de snapping relativa al ancho del corredor y la velocidad actual.
        /// </summary>
        public static float CalculateSnapWindow(float corridorWidth, float currentVelocity, float bufferFactor = 0.15f)
        {
            return (corridorWidth * 0.35f) + (currentVelocity * bufferFactor);
        }

        private static Vector2 QuantizeToCardinal(Vector2 input)
        {
            if (Mathf.Abs(input.x) > Mathf.Abs(input.y))
            {
                return new Vector2(Mathf.Sign(input.x), 0f);
            }
            return new Vector2(0f, Mathf.Sign(input.y));
        }
    }
}
