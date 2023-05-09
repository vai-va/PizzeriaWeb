using System.ComponentModel.DataAnnotations;

namespace PizzaStore.Models
{
    public class Topping
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public decimal Price { get; set; }
    }
}
