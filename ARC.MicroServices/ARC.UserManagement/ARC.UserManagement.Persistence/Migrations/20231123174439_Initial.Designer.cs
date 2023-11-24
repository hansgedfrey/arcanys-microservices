﻿// <auto-generated />
using System;
using ARC.UserManagement.Persistence.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace ARC.UserManagement.Persistence.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20231123174439_Initial")]
    partial class Initial
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.13")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("ARC.UserManagement.Persistence.Entities.User", b =>
                {
                    b.Property<Guid>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("ARC.UserManagement.Persistence.Events.AbstractEvent", b =>
                {
                    b.Property<Guid>("EventId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Occurred")
                        .HasColumnType("datetime2");

                    b.Property<Guid?>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("EventId");

                    b.HasIndex("UserId");

                    b.ToTable("Events");

                    b.HasDiscriminator<string>("Discriminator").HasValue("AbstractEvent");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("ARC.UserManagement.Persistence.Events.ChangePasswordEvent", b =>
                {
                    b.HasBaseType("ARC.UserManagement.Persistence.Events.AbstractEvent");

                    b.HasDiscriminator().HasValue("ChangePasswordEvent");
                });

            modelBuilder.Entity("ARC.UserManagement.Persistence.Events.LoginEvent", b =>
                {
                    b.HasBaseType("ARC.UserManagement.Persistence.Events.AbstractEvent");

                    b.HasDiscriminator().HasValue("LoginEvent");
                });

            modelBuilder.Entity("ARC.UserManagement.Persistence.Events.RegisterEvent", b =>
                {
                    b.HasBaseType("ARC.UserManagement.Persistence.Events.AbstractEvent");

                    b.HasDiscriminator().HasValue("RegisterEvent");
                });

            modelBuilder.Entity("ARC.UserManagement.Persistence.Events.UpdateProfileEvent", b =>
                {
                    b.HasBaseType("ARC.UserManagement.Persistence.Events.AbstractEvent");

                    b.HasDiscriminator().HasValue("UpdateProfileEvent");
                });

            modelBuilder.Entity("ARC.UserManagement.Persistence.Events.AbstractEvent", b =>
                {
                    b.HasOne("ARC.UserManagement.Persistence.Entities.User", null)
                        .WithMany("Events")
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("ARC.UserManagement.Persistence.Entities.User", b =>
                {
                    b.Navigation("Events");
                });
#pragma warning restore 612, 618
        }
    }
}