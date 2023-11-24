using ARC.UserAuthManagement.Web.Models;

namespace ARC.UserAuthManagement.Web.Services.Http
{
    public interface ICategoryHttpClient
    {
        Task<Guid> InsertCategoryAsync(CategoryDto category);
        Task<CategoryDto> GetCategoryAsync(Guid categoryId);
    }
}
