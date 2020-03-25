using System;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Value> Values { get; set; }

        public DbSet<Activity> Activities { get; set; }

        public DbSet<UserActivity> UserActivities { get; set; }

        public DbSet<Photo> Photos { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Value>()
               .HasData(
                   new Value { Id = 1, Name = "Farshid" },
                   new Value { Id = 2, Name = "Torkaman" },
                   new Value { Id = 3, Name = "Test" }
               );

            builder.Entity<UserActivity>(f => f.HasKey(ua => new { ua.AppUserId, ua.AcitivtyId }));

            builder.Entity<UserActivity>()
                .HasOne(f => f.AppUser)
                .WithMany(f => f.UserActivities)
                .HasForeignKey(f => f.AppUserId);

            builder.Entity<UserActivity>()
                .HasOne(f => f.Activity)
                .WithMany(f => f.UserActivities)
                .HasForeignKey(f => f.AcitivtyId);
        }
    }
}
