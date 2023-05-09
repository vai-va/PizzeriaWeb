using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace PizzaStore.Models
{
    public class PizzaOrder
    {
        [Key]
        public int Id { get; set; }

        [BindProperty] // add this attribute
        public Pizza? Pizza { get; set; }

        public List<Topping>? Toppings { get; set; }

        public decimal TotalCost { get; set; }
    }


}
