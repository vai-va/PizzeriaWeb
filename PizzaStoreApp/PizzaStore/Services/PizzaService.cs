// This class provides services related to pizzas and orders.
using PizzaStore.Models;
using PizzaStore.Data;

namespace PizzaStore.Services
{
    public class PizzaService
    {
        private readonly PizzaDbContext _context;

        // Constructor to inject PizzaDbContext
        public PizzaService(PizzaDbContext context)
        {
            _context = context;
        }

        // Get a pizza by its ID
        public async Task<Pizza> GetPizzaById(int id)
        {
            var pizza = await _context.Pizzas.FindAsync(id);
            return pizza ?? throw new ArgumentException("Invalid pizza ID.");
        }

        // Get a list of all pizza orders
        public List<PizzaOrder> GetOrders() => _context.PizzaOrders.ToList();

        // Get a pizza order by its ID
        public PizzaOrder GetOrder(int id)
        {
            var order = _context.PizzaOrders.Find(id);
            if (order == null)
            {
                throw new ArgumentException("Invalid order ID.");
            }
            return order;
        }


        // Calculate the total cost of a pizza order
        public async Task<decimal> CalculateTotalCost(PizzaOrder order)
        {
            if (order == null || order.Pizza == null || order.Toppings == null)
            {
                throw new ArgumentException("Invalid order data");
            }

            var pizza = await _context.Pizzas.FindAsync(order.Pizza.Id);
            if (pizza == null)
            {
                throw new ArgumentException("Invalid PizzaId in the order.");
            }

            var totalCost = pizza.Price + order.Toppings.Sum(t => t.Price);

            if (order.Toppings.Count > 3)
            {
                totalCost *= 0.9m;
            }

            return totalCost;
        }
    }
}
