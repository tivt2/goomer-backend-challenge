# Goomer backend challenge

This is an API created following the [goomer backend challenge](https://github.com/goomerdev/job-dev-backend-interview).

# Build

To run this project you must have Docker installed. Note that the database container is only temporary and no volumes are created.

## To build the project:
```bash
# ignore this command if database container is already down
docker compose down

npm run build
npm run docker:app
```

## To run the tests:
```bash
# ignore this command if database container is already down
docker compose down

npm run docker:db
npm run docker:test
```

# Structure

Since the challenge asked for a close-to-finished product, some considerations were made.

The project was structured in a way that separates code mainly by features and common code. One of the ideas was to decouple as much as possible the business logic from any 3rd party tools so if structural changes are needed it could be made without much extra work.

Also to avoid dealing with javascript exception handling, I mainly dealt with errors as soon as they are thrown, and returned errors as values, while also having a catch all type of exception handler as a last resort.

Only basic tests were made, so no edge cases were checked, but the basic structure for testing was added.

# Database

The challenge also asked for raw SQL queries, so the amount of knowledge could be visible.

Here i found some challenges when representing the object structures, i stayed between creating mainly 2 tables, one for restaurants and another for products, where the working time of the restaurants would be inside the restaurants table and the promotion and promotion working time also would be inside the products table all in json format, but to maintain scalability and have some functionality growth margin for the API i decided to make it into separated tables and join then during the query operations.
Here I found some challenges when representing the object structures. I considered creating mainly two tables, one for restaurants and another for products, where the working time of the restaurants would be inside the restaurants table and the promotion and promotion working time would also be inside the products table, all in JSON format. However, to maintain scalability and have some functional growth margin for the API, I decided to separate them into different tables and join them during the query operations.

The final structure stayed as:
```
restaurants:
| id | name | address | picture |

restaurant_operations:
| id | restaurant_id | start_day | end_day | start_time | end_time |

products:
| id | name | price | category | picture |

product_promotion:
| id | product_id | description | price |

product_promotion_operations:
| id | product_id | start_day | end_day | start_time | end_time |
```

# Tools

Some aditional 3rd party tools were added:

*zod*, for request validation.
*pg-client*, for database communication and facilitated query sanitizing.

During the challenge i made a very simple and basic tool to migrate the database schema and facilitate testing.

The challenge asked to validate any time data in a specific way, so 2 functions were created to deal with this requisite.
