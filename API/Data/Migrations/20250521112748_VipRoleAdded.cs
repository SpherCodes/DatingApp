using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class VipRoleAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserVisits",
                columns: table => new
                {
                    VisitorId = table.Column<int>(type: "INTEGER", nullable: false),
                    VisitedId = table.Column<int>(type: "INTEGER", nullable: false),
                    VisitDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserVisits", x => new { x.VisitorId, x.VisitedId });
                    table.ForeignKey(
                        name: "FK_UserVisits_AspNetUsers_VisitedId",
                        column: x => x.VisitedId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserVisits_AspNetUsers_VisitorId",
                        column: x => x.VisitorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserVisits_VisitedId",
                table: "UserVisits",
                column: "VisitedId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserVisits");
        }
    }
}
