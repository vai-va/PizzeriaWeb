using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using PizzaStore.Models;
using PizzaStore.Data;
using PizzaStore.Services;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace PizzaStore.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PizzaOrdersController : ControllerBase
    {
        private readonly PizzaService _pizzaService;
        private readonly PizzaDbContext _context;

        public PizzaOrdersController(PizzaService pizzaService, PizzaDbContext context)
        {
            _pizzaService = pizzaService;
            _context = context;
        }


        // Retrieves the pizza order with the specified ID.
        [HttpGet("{id}")]
        public ActionResult<PizzaOrder> GetById(int id)
        {
            var order = _pizzaService.GetOrder(id);
            if (order == null)
            {
                return NotFound();
            }
            return order;
        }


        // Retrieves all pizza orders, with selected information.
        [HttpGet]
        public IActionResult GetAll()
        {
            var orders = _pizzaService.GetOrders()
                .Select(order => new
                {
                    order.Id,
                    size = order.Pizza?.Size,
                    toppings = order.Toppings?.Select(t => t.Name),
                    totalPrice = order.TotalCost
                })
                .ToList();

            return Ok(orders);
        }


        // Retrieves the size and price of pizzas with specified IDs.
        [HttpGet("pizzaSizeAndPrice")]
        public IActionResult GetSizeAndPrice([FromQuery] List<int> pizzaIds)
        {
            return Ok(_context.Pizzas.Where(p => pizzaIds.Contains(p.Id)).Select(p => new { p.Id, p.Size, p.Price }).ToList());
        }


        // Retrieves all existing pizza IDs.
        [HttpGet("allPizzaIds")]
        public IActionResult GetAllPizzaIds()
        {
            return Ok(_context.Pizzas.Select(p => p.Id).ToList());
        }


        // Retrieves all existing topping IDs.
        [HttpGet("allToppingIds")]
        public IActionResult GetAllToppingIds()
        {
            return Ok(_context.Toppings.Select(t => t.Id).ToList());
        }


        // Retrieves the name and price of toppings with specified IDs.
        [HttpGet("toppingNameAndPrice")]
        public IActionResult GetToppingNameAndPrice([FromQuery] List<int> toppingIds)
        {
            var toppings = _context.Toppings
                .Where(t => toppingIds.Contains(t.Id))
                .Select(t => new { t.Id, Name = t.Name ?? string.Empty, t.Price })
                .ToList();

            return Ok(toppings);
        }


        // Creates a new pizza order.
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] PizzaOrder pizzaOrder)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (pizzaOrder == null || pizzaOrder.Pizza == null || pizzaOrder.Toppings == null)
            {
                return BadRequest("Invalid pizza order data");
            }

            // Gets the actual Pizza object from the database using its ID
            var pizza = await _pizzaService.GetPizzaById(pizzaOrder.Pizza.Id);
            if (pizza == null)
            {
                return BadRequest("Invalid Pizza ID");
            }

            // Attaches the Pizza object to the context
            _context.Attach(pizza);

            // Gets the actual Topping objects from the database using their IDs
            var toppingIds = pizzaOrder.Toppings.Select(t => t.Id).ToList();
            var toppings = await _context.Toppings.Where(t => toppingIds.Contains(t.Id)).ToListAsync();
            var totalCost = await _pizzaService.CalculateTotalCost(pizzaOrder);


            // Creates a new PizzaOrder object with the loaded Pizza and Topping objects
            var newOrder = new PizzaOrder
            {
                Pizza = pizza,
                Toppings = toppings,
                TotalCost = totalCost  // Sets the total cost here
            };
            _context.PizzaOrders.Add(newOrder);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = newOrder.Id }, newOrder);
        }


        // Retrieves the total cost of order
        [HttpPost("calculateTotalCost")]
        public async Task<IActionResult> CalculateTotalCost([FromBody] PizzaOrder order)
        {
            if (order == null || order.Pizza == null || order.Toppings == null)
            {
                return BadRequest("Invalid order data");
            }

            var totalCost = await _pizzaService.CalculateTotalCost(order);
            return Ok(totalCost);
        }

        // Calculates the total price of all orders
        [HttpGet("totalOrdersPrice")]
        public IActionResult GetTotalOrdersPrice()
        {
            var orders = _pizzaService.GetOrders();
            var totalPrice = orders.Sum(o => o.TotalCost);
            return Ok(new { TotalPrice = totalPrice });
        }

        // Calculate the price of the current pizza order without saving it
        [HttpPost("calculateCurrentOrderPrice")]
        public async Task<IActionResult> CalculateCurrentOrderPrice([FromBody] PizzaOrder order)
        {
            var totalPrice = await _pizzaService.CalculateTotalCost(order);
            return Ok(new { TotalPrice = totalPrice });
        }

    }
}