using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<AppUser> Users { get; set; }
        public DbSet<UserLike> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder Builder)
        {
            base.OnModelCreating(Builder);

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
