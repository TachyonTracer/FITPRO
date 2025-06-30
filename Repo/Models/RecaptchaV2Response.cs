using System.Text.Json.Serialization;
using Repo;
public class RecaptchaV2Response
    {
        [JsonPropertyName("success")]
        public bool success { get; set; }

        [JsonPropertyName("challenge_ts")]
        public string? challengeTimestamp { get; set; }

        [JsonPropertyName("hostname")]
        public string hostname { get; set; }

        [JsonPropertyName("error-codes")]
        public string[] errorCodes { get; set; }
    }