using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace API.Data
{
    public class DataContext(DbContextOptions options) : IdentityDbContext<AppUser, AppRole, int,
    IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>,
    IdentityUserToken<int>>(options)
    {

        public new DbSet<AppUser> Users { get; set; }
        public DbSet<UserLike> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Connection> Connections { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<UserVisit> UserVisits { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<AppUser>()
                .HasMany(ur => ur.userRoles)
                .WithOne(u => u.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();

            builder.Entity<AppRole>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();


            builder.Entity<UserLike>()
                .HasKey(x => new { x.SourceUserId, x.TargetUserId });

            builder.Entity<UserLike>()
                .HasOne(x => x.SourceUser)
                .WithMany(x => x.LikedUsers)
                .HasForeignKey(x => x.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserLike>()
                .HasOne(x => x.TargetUser)
                .WithMany(x => x.LikedByUsers)
                .HasForeignKey(x => x.TargetUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Message>()
                .HasOne(x => x.Recipient)
                .WithMany(x => x.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(x => x.Sender)
                .WithMany(x => x.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
                .HasOne(u => u.Sender)
                .WithMany(m => m.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Photo>().HasQueryFilter(p => p.IsApproved);

            builder.Entity<UserVisit>()
                .HasOne(v => v.Visitor)
                .WithMany(u => u.UserVisits)
                .HasForeignKey(v => v.VisitorId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<UserVisit>()
                .HasOne(v => v.Visited)
                .WithMany(u => u.VisitedUsers)
                .HasForeignKey(v => v.VisitedId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<UserVisit>()
                .HasKey(x => new { x.VisitorId, x.VisitedId });
        }
    }
}
