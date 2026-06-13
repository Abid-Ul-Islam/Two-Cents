using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TwoCents_WebApi.Migrations
{
    /// <inheritdoc />
    public partial class AddAuthorNameInBlogEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AuthorName",
                table: "Blogs",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AuthorName",
                table: "Blogs");
        }
    }
}
