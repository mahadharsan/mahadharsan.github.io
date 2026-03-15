# Dbt Basics

### What is dbt?
dbt is an open-source transformation framework used in modern data engineering

### What it does
dbt sits in the "T" of the ELT pipeline (Extract, Load, Transform)

### why dbt?
To understand this, we have to understand what what does people do for transformation without dbt
 * Raw SQL notebooks — works small scale, breaks at scale
 * Stored procedures — SQL saved inside the warehouse itself, hard to version or test
 * Python/Spark scripts — more powerful but complex, overkill for pure transformation
 * Looker LookML / Tableau calculated fields — transformation hidden inside BI tools, invisible to everyone else
 * Custom ETL scripts — someone wrote a Python script years ago, nobody touches it anymore

### What dbt actually adds

dbt doesn't replace SQL. You're still writing SQL. It just wraps it with:

| Problem | dbt's answer |
|---|---|
| Queries scattered everywhere | All `.sql` files in one Git repo |
| Nobody knows the order to run things | Automatic DAG from dependencies |
| No testing | Built-in data quality tests |
| No documentation | Auto-generated from your code |
| Something broke, don't know what | Full lineage graph showing what affects what |


### In short 

You opened a BigQuery notebook, wrote a SQL query, and ran it. Where did the result go?
It either:

Showed up on your screen as a preview
Or got saved as a new table somewhere in BigQuery

Right?
Now imagine you have 20 of those queries, and each one depends on the previous one. Like:
Query 1 cleans raw orders
Query 2 joins cleaned orders with customers
Query 3 calculates revenue per customer using Query 2's result

Question: how do you manage that today, without dbt?
You'd probably just run them manually one by one in the right order. That works for 20 queries. But what about 200? Or 2000?

That's the exact problem dbt's project structure solves: it gives all those queries a home, an order, and a system.