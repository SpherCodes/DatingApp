using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
    {
        public async Task<MemberDto?> GetMemberAsync(string username)
        {
            return await context.Users
                .Where(x => x.UserName == username)
                .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                .SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = context.Users.AsQueryable();

            query = query.Where(x => x.UserName != userParams.CurrentUsername);

            if (userParams.Gender != null)
            {
                query = query.Where(x => x.Gender == userParams.Gender);
            }

            var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1));
            var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));

            query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);

            query = userParams.Orderby switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };


            return await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(mapper.ConfigurationProvider),
                userParams.PageNumber, userParams.PageSize);
        }

        public async Task<AppUser?> GetUserByIdAsync(int id)
        {
            return await context.Users.FindAsync(id);
        }

        public async Task<AppUser?> GetUserByUsernameAsync(string username)
        {
            return await context.Users
                .Include(p => p.Photos)
                .SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<MemberDto> GetMemberAsync(string username, bool isCurrentUser)
        {
            var query = context.Users
                .Where(x => x.UserName == username)
                .ProjectTo<MemberDto>(mapper.ConfigurationProvider)
                .AsQueryable();
            if (isCurrentUser) query = query.IgnoreQueryFilters();

            var member = await query.FirstOrDefaultAsync();
            if (member == null)
                throw new InvalidOperationException("Member not found.");

            return member;
        }

        public async Task<AppUser?> GetUserByPhotoId(int photoId)
        {
            return await context.Users
                        .Include(p => p.Photos)
                        .IgnoreQueryFilters()
                        .Where(p => p.Photos.Any(p => p.Id == photoId))
                        .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await context.Users
                .Include(p => p.Photos)
                .ToListAsync();
        }

        public void Update(AppUser user)
        {
            context.Entry(user).State = EntityState.Modified;
        }
        public void AddVisit(UserVisit visit)
        {
            context.UserVisits.Add(visit);
        }

        public async Task<UserVisit?> GetUserVisitAsync(int visitorId, int visitedId)
        {
            return await context.UserVisits
                .FirstOrDefaultAsync(x => x.VisitorId == visitorId && x.VisitedId == visitedId);
        }
        public async Task<PagedList<VisitDto>> GetUserVisitorsAsync(int userId, PaginationParams paginationParams, bool pastMonthOnly = false)
        {
            // Get users who visited the current user (VisitedId == userId)
            var query = context.UserVisits
                .Where(x => x.VisitedId == userId);

            if (pastMonthOnly)
            {
                var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);
                query = query.Where(x => x.VisitDate >= oneMonthAgo);
            }

            var finalQuery = query
                .OrderByDescending(x => x.VisitDate)
                .ProjectTo<VisitDto>(mapper.ConfigurationProvider);

            return await PagedList<VisitDto>.CreateAsync(finalQuery, paginationParams.PageNumber, paginationParams.PageSize);
        }

        public async Task<PagedList<VisitDto>> GetUserVisitsAsync(int userId, PaginationParams paginationParams, bool pastMonthOnly = false)
        {
            // Get users that the current user visited (VisitorId == userId)
            var query = context.UserVisits
                .Where(x => x.VisitorId == userId);

            if (pastMonthOnly)
            {
                var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);
                query = query.Where(x => x.VisitDate >= oneMonthAgo);
            }

            var finalQuery = query
                .Include(x => x.Visited)
                .ThenInclude(x => x!.Photos)
                .OrderByDescending(x => x.VisitDate)
                .Select(x => new VisitDto
                {
                    VisitorId = x.VisitedId, 
                    VisitorUsername = x.Visited!.UserName!, 
                    VisitorPhotoUrl = x.Visited.Photos.FirstOrDefault(p => p.IsMain)!.Url, 
                    VisitorKnownAs = x.Visited.KnownAs!,
                    VisitDate = x.VisitDate
                });

            return await PagedList<VisitDto>.CreateAsync(finalQuery, paginationParams.PageNumber, paginationParams.PageSize);
        }
    }
}

