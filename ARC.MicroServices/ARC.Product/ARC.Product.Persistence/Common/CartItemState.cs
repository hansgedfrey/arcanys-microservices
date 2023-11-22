
using System.Text.Json.Serialization;

namespace ARC.Product.Persistence.Common
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum CartItemState
    {
        None,
        Added,
        Removed
    }
}
