using System.Text.Json;
using API.Entities;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");

            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

            var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);

            if (users == null) return;

            var roles = new List<AppRole>
            {
                new() {Name = "Member"},
                new() {Name = "Admin"},
                new() {Name = "Moderator"},
                new() {Name = "VIP"}
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            // Create regular members
            foreach (var user in users)
            {
                user.UserName = user.UserName!.ToLower();
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");
                user.Photos.First().IsMain = true;
                user.Photos.First().IsApproved = true;
            }

            // Make some users VIP for testing
            var vipUsernames = new[] { "lisa", "karen", "todd", "lana", "becky" };
            foreach (var vipUsername in vipUsernames)
            {
                var user = await userManager.FindByNameAsync(vipUsername);
                if (user != null)
                {
                    await userManager.AddToRoleAsync(user, "VIP");
                }
            }

            // Create admin user
            var admin = new AppUser
            {
                UserName = "admin",
                KnownAs = "Admin",
                Gender = "",
                City = "London",
                Country = "UK",
            };

            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRolesAsync(admin, ["Admin", "Moderator", "VIP"]);
        }

        public static async Task SeedVisits(DataContext context)
        {
            if (await context.UserVisits.AnyAsync()) return;

            var users = await context.Users.ToListAsync();
            if (users.Count < 2) return;

            var random = new Random();
            var visits = new List<UserVisit>();

            // Generate visits for the past 3 months to test filtering
            var startDate = DateTime.UtcNow.AddMonths(-3);
            var endDate = DateTime.UtcNow;            // Create realistic visit patterns - focus on VIP users
            // Get VIP users for focused testing
            var vipUsernames = new[] { "lisa", "karen", "todd", "lana", "becky", "admin" };
            var vipUsers = users.Where(u => vipUsernames.Contains(u.UserName!.ToLower())).ToList();

            for (int i = 0; i < users.Count; i++)
            {
                var visitor = users[i];
                var isVip = vipUsers.Contains(visitor);

                // VIP users visit more people, and get visited more often
                var visitCount = isVip ? random.Next(8, 20) : random.Next(3, 12);
                var visitedUsers = users.Where(u => u.Id != visitor.Id)
                                      .OrderBy(x => random.Next())
                                      .Take(visitCount)
                                      .ToList();

                foreach (var visitedUser in visitedUsers)
                {
                    // Generate random visit date
                    var randomDays = random.Next(0, (endDate - startDate).Days);
                    var visitDate = startDate.AddDays(randomDays);
                    // Add some random hours/minutes
                    visitDate = visitDate.AddHours(random.Next(0, 24))
                                        .AddMinutes(random.Next(0, 60));

                    // Check if this visit already exists (only keep the latest visit)
                    var existingVisit = visits.FirstOrDefault(v =>
                        v.VisitorId == visitor.Id && v.VisitedId == visitedUser.Id);

                    if (existingVisit != null)
                    {
                        // Keep only the more recent visit
                        if (visitDate > existingVisit.VisitDate)
                        {
                            visits.Remove(existingVisit);
                            visits.Add(new UserVisit
                            {
                                VisitorId = visitor.Id,
                                VisitedId = visitedUser.Id,
                                VisitDate = visitDate
                            });
                        }
                    }
                    else
                    {
                        visits.Add(new UserVisit
                        {
                            VisitorId = visitor.Id,
                            VisitedId = visitedUser.Id,
                            VisitDate = visitDate
                        });
                    }
                }
            }            // Add extra visits in the past month for testing the time filter
            // Focus more on VIP users having recent activity
            var pastMonthStart = DateTime.UtcNow.AddMonths(-1);

            // VIP users get more recent visits
            foreach (var vipUser in vipUsers)
            {
                var recentVisitCount = random.Next(5, 10);
                var recentTargets = users.Where(u => u.Id != vipUser.Id)
                                        .OrderBy(x => random.Next())
                                        .Take(recentVisitCount)
                                        .ToList();

                foreach (var target in recentTargets)
                {
                    var randomDays = random.Next(0, 30);
                    var visitDate = pastMonthStart.AddDays(randomDays)
                                                .AddHours(random.Next(0, 24))
                                                .AddMinutes(random.Next(0, 60));

                    var existingVisit = visits.FirstOrDefault(v =>
                        v.VisitorId == vipUser.Id && v.VisitedId == target.Id);

                    if (existingVisit != null)
                    {
                        if (visitDate > existingVisit.VisitDate)
                        {
                            existingVisit.VisitDate = visitDate;
                        }
                    }
                    else
                    {
                        visits.Add(new UserVisit
                        {
                            VisitorId = vipUser.Id,
                            VisitedId = target.Id,
                            VisitDate = visitDate
                        });
                    }
                }
            }

            // Regular users also visit occasionally
            for (int i = 0; i < 15; i++)
            {
                var visitor = users[random.Next(users.Count)];
                var visitedUser = users.Where(u => u.Id != visitor.Id)
                                     .OrderBy(x => random.Next())
                                     .First();

                var randomDays = random.Next(0, 30); var visitDate = pastMonthStart.AddDays(randomDays)
                                            .AddHours(random.Next(0, 24))
                                            .AddMinutes(random.Next(0, 60));

                // Only add if this combination doesn't exist or update if this is more recent
                var existingVisit = visits.FirstOrDefault(v =>
                    v.VisitorId == visitor.Id && v.VisitedId == visitedUser.Id);

                if (existingVisit != null)
                {
                    if (visitDate > existingVisit.VisitDate)
                    {
                        existingVisit.VisitDate = visitDate;
                    }
                }
                else
                {
                    visits.Add(new UserVisit
                    {
                        VisitorId = visitor.Id,
                        VisitedId = visitedUser.Id,
                        VisitDate = visitDate
                    });
                }
            }            // Add some very recent visits (last week) for immediate testing
            var lastWeek = DateTime.UtcNow.AddDays(-7);
            for (int i = 0; i < 15; i++)
            {
                var visitor = users[random.Next(users.Count)];
                var visitedUser = users.Where(u => u.Id != visitor.Id)
                                     .OrderBy(x => random.Next())
                                     .First();

                var randomDays = random.Next(0, 7);
                var visitDate = lastWeek.AddDays(randomDays)
                                       .AddHours(random.Next(0, 24))
                                       .AddMinutes(random.Next(0, 60));

                var existingVisit = visits.FirstOrDefault(v =>
                    v.VisitorId == visitor.Id && v.VisitedId == visitedUser.Id);

                if (existingVisit != null)
                {
                    if (visitDate > existingVisit.VisitDate)
                    {
                        existingVisit.VisitDate = visitDate;
                    }
                }
                else
                {
                    visits.Add(new UserVisit
                    {
                        VisitorId = visitor.Id,
                        VisitedId = visitedUser.Id,
                        VisitDate = visitDate
                    });
                }
            }

            // Add some clearly older visits (2-3 months ago) to make filtering more obvious
            var olderDate = DateTime.UtcNow.AddMonths(-2);
            foreach (var vipUser in vipUsers.Take(3))
            {
                var targets = users.Where(u => u.Id != vipUser.Id).Take(3).ToList();
                foreach (var target in targets)
                {
                    var visitDate = olderDate.AddDays(random.Next(-15, 15))
                                           .AddHours(random.Next(0, 24));

                    // Only add if no existing visit for this pair exists
                    if (!visits.Any(v => v.VisitorId == vipUser.Id && v.VisitedId == target.Id))
                    {
                        visits.Add(new UserVisit
                        {
                            VisitorId = vipUser.Id,
                            VisitedId = target.Id,
                            VisitDate = visitDate
                        });
                    }
                }
            }

            context.UserVisits.AddRange(visits);
            await context.SaveChangesAsync();
        }
    }
}
