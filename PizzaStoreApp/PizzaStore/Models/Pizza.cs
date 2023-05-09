using System.ComponentModel.DataAnnotations;

namespace PizzaStore.Models
{
    public class Pizza
    {
        [Key]
        public int Id { get; set; }
        public string? Size { get; set; }
        public decimal Price { get; set; }
    }
}
