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

        public DbSet<AppUser> Users { get; set; }
        public DbSet<UserLike> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Connection> Connections { get; set; }

        protected override void OnModelCreating(ModelBuilder Builder)
        {
            base.OnModelCreating(Builder);

            Builder.Entity<AppUser>()
                .HasMany(ur => ur.userRoles)
                .WithOne(u => u.User)
                .HasForeignKey(ur => ur.UserId)
                .IsRequired();

            Builder.Entity<AppRole>()
                .HasMany(ur => ur.UserRoles)
                .WithOne(u => u.Role)
                .HasForeignKey(ur => ur.RoleId)
                .IsRequired();


            Builder.Entity<UserLike>()
                .HasKey(x => new { x.SourceUserId, x.TargetUserId });

            Builder.Entity<UserLike>()
                .HasOne(x => x.SourceUser)
                .WithMany(x => x.LikedUsers)
                .HasForeignKey(x => x.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);

            Builder.Entity<UserLike>()
                .HasOne(x => x.TargetUser)
                .WithMany(x => x.LikedByUsers)
                .HasForeignKey(x => x.TargetUserId)
                .OnDelete(DeleteBehavior.Cascade);

            Builder.Entity<Message>()
                .HasOne(x => x.Recipient)
                .WithMany(x => x.MessagesReceived)
                .OnDelete(DeleteBehavior.Restrict);

            Builder.Entity<Message>()
                .HasOne(x => x.Sender)
                .WithMany(x => x.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
