using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TwoCents_WebApi.Migrations
{
    /// <inheritdoc />
    public partial class SeedTags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Tag",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Slug = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tag", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Tag",
                columns: new[] { "Id", "Name", "Slug" },
                values: new object[,]
                {
                    { 1, "Science", "science" },
                    { 2, "Philosophy", "philosophy" },
                    { 3, "Math", "math" },
                    { 4, "Politics", "politics" },
                    { 5, "Technology", "technology" },
                    { 6, "Programming", "programming" },
                    { 7, "Artificial Intelligence", "artificial-intelligence" },
                    { 8, "Machine Learning", "machine-learning" },
                    { 9, "Data Science", "data-science" },
                    { 10, "History", "history" },
                    { 11, "Economics", "economics" },
                    { 12, "Psychology", "psychology" },
                    { 13, "Sociology", "sociology" },
                    { 14, "Health", "health" },
                    { 15, "Fitness", "fitness" },
                    { 16, "Medicine", "medicine" },
                    { 17, "Literature", "literature" },
                    { 18, "Art", "art" },
                    { 19, "Music", "music" },
                    { 20, "Mathematics", "mathematics" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Tag");
        }
    }
}
