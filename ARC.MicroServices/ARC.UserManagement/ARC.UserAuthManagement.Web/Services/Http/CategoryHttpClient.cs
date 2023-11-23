using ARC.UserAuthManagement.Web.Models;
using System.Text.Json;
using System.Text;

namespace ARC.UserAuthManagement.Web.Services.Http
{
    public class CategoryHttpClient : ICategoryHttpClient
    {
        private readonly HttpClient _httpClient; 
        private readonly string _baseUrl;

        public CategoryHttpClient(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient; 
            _baseUrl = configuration["ProductServiceUrl"] ?? string.Empty;
        }

        public async Task<CategoryDto> GetCategoryAsync(Guid categoryId)
        {
            if(categoryId == Guid.Empty) throw new ArgumentNullException(nameof(categoryId));
             
            var response = await _httpClient.GetAsync(new Uri(new Uri(_baseUrl), $"categories/category/{categoryId}"));

            if (!response.IsSuccessStatusCode) throw new InvalidOperationException("Failed fetch");
            
            var responseContent = await response.Content.ReadAsStringAsync();
            var category = JsonSerializer.Deserialize<CategoryDto>(responseContent,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

            return category!;
        }

        public async Task<Guid> InsertCategoryAsync(CategoryDto category)
        {
            var httpContent = new StringContent(
                JsonSerializer.Serialize(category),
                Encoding.UTF8,
                "application/json");
              
            var response = await _httpClient.PostAsync(new Uri(new Uri(_baseUrl), "categories/upsert-category"), httpContent);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode) throw new InvalidOperationException("Post failed");
            
            Guid.TryParse(JsonSerializer.Deserialize<string>(responseContent), out var categoryId);

            return categoryId;
        }
    }
}
