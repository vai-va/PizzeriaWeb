using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using PizzaStore.Models;
using PizzaStore.Services;
using PizzaStore.Data;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();


// Adds services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<PizzaDbContext>(options =>
options.UseInMemoryDatabase("PizzaStore"));
builder.Services.AddScoped<PizzaService>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "PizzaStore API", Version = "v1" });
});

var app = builder.Build();

app.UseCors(options => options
    .WithOrigins("http://localhost:3000")
    .AllowAnyMethod()
    .AllowAnyHeader()
);

// Seed initial data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<PizzaDbContext>();

    // Add initial data for pizza sizes
    context.Pizzas.AddRange(
        new Pizza { Id = 1, Size = "Small", Price = 8 },
        new Pizza { Id = 2, Size = "Medium", Price = 10 },
        new Pizza { Id = 3, Size = "Large", Price = 12 }
    );

    // Add initial data for toppings
    context.Toppings.AddRange(
        new Topping { Id = 1, Name = "Pepperoni", Price = 1 },
        new Topping { Id = 2, Name = "Onions", Price = 1 },
        new Topping { Id = 3, Name = "Ham", Price = 1 },
        new Topping { Id = 4, Name = "Extra cheese", Price = 1 },
        new Topping { Id = 5, Name = "Bacon", Price = 1 },
        new Topping { Id = 6, Name = "Tomatoes", Price = 1 },
        new Topping { Id = 7, Name = "Mushrooms", Price = 1 },
        new Topping { Id = 8, Name = "Chicken", Price = 1 },
        new Topping { Id = 9, Name = "Spinach", Price = 1 },
        new Topping { Id = 10, Name = "Black olives", Price = 1 },
        new Topping { Id = 11, Name = "Jalapenos", Price = 1 },
        new Topping { Id = 12, Name = "Sausage", Price = 1 }
    );



    context.SaveChanges();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();