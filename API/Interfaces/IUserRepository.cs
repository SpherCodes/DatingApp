using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser?> GetUserByIdAsync(int id);
        Task<AppUser?> GetUserByUsernameAsync(string username);
        Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
        Task<MemberDto?> GetMemberAsync(string username);
        Task<MemberDto> GetMemberAsync(string username, bool isCurrentUser);
        Task<AppUser?> GetUserByPhotoId(int photoId);
        void AddVisit(UserVisit visit);
        Task<PagedList<VisitDto>> GetUserVisitorsAsync(int userId, PaginationParams paginationParams);
        Task<PagedList<VisitDto>> GetUserVisitsAsync(int userId, PaginationParams paginationParams);
    }
}
