using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServiceTrack.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddRequestTimestamps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ResolvedAt",
                table: "ServiceRequests",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "ServiceRequests",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResolvedAt",
                table: "ServiceRequests");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "ServiceRequests");
        }
    }
}
