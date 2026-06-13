using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TwoCents_WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddUpvoteTable2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Upvote_Blogs_BlogId",
                table: "Upvote");

            migrationBuilder.DropForeignKey(
                name: "FK_Upvote_Users_UserId",
                table: "Upvote");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Upvote",
                table: "Upvote");

            migrationBuilder.RenameTable(
                name: "Upvote",
                newName: "Upvotes");

            migrationBuilder.RenameIndex(
                name: "IX_Upvote_BlogId",
                table: "Upvotes",
                newName: "IX_Upvotes_BlogId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Upvotes",
                table: "Upvotes",
                columns: new[] { "UserId", "BlogId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Upvotes_Blogs_BlogId",
                table: "Upvotes",
                column: "BlogId",
                principalTable: "Blogs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Upvotes_Users_UserId",
                table: "Upvotes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Upvotes_Blogs_BlogId",
                table: "Upvotes");

            migrationBuilder.DropForeignKey(
                name: "FK_Upvotes_Users_UserId",
                table: "Upvotes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Upvotes",
                table: "Upvotes");

            migrationBuilder.RenameTable(
                name: "Upvotes",
                newName: "Upvote");

            migrationBuilder.RenameIndex(
                name: "IX_Upvotes_BlogId",
                table: "Upvote",
                newName: "IX_Upvote_BlogId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Upvote",
                table: "Upvote",
                columns: new[] { "UserId", "BlogId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Upvote_Blogs_BlogId",
                table: "Upvote",
                column: "BlogId",
                principalTable: "Blogs",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Upvote_Users_UserId",
                table: "Upvote",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
