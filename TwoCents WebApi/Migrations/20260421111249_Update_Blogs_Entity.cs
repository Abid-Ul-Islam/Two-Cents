using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TwoCents_WebApi.Migrations
{
    /// <inheritdoc />
    public partial class Update_Blogs_Entity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Blogs_Users_UserId",
                table: "Blogs");

            migrationBuilder.DropIndex(
                name: "IX_Blogs_UserId",
                table: "Blogs");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Blogs",
                newName: "Body");

            migrationBuilder.RenameColumn(
                name: "Text",
                table: "Blogs",
                newName: "AuthorId");

            migrationBuilder.RenameColumn(
                name: "BlogId",
                table: "Blogs",
                newName: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Blogs_AuthorId",
                table: "Blogs",
                column: "AuthorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Blogs_Users_AuthorId",
                table: "Blogs",
                column: "AuthorId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Blogs_Users_AuthorId",
                table: "Blogs");

            migrationBuilder.DropIndex(
                name: "IX_Blogs_AuthorId",
                table: "Blogs");

            migrationBuilder.RenameColumn(
                name: "Body",
                table: "Blogs",
                newName: "UserId");

            migrationBuilder.RenameColumn(
                name: "AuthorId",
                table: "Blogs",
                newName: "Text");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Blogs",
                newName: "BlogId");

            migrationBuilder.CreateIndex(
                name: "IX_Blogs_UserId",
                table: "Blogs",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Blogs_Users_UserId",
                table: "Blogs",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
