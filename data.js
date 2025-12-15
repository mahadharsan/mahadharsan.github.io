// Portfolio Data - Projects, Experience, Skills
// This file contains all the content data for easy updates

export const experienceData = [
  {
    title: "Career Advisor",
    company: "Khoury College of Computer Sciences, Northeastern University",
    location: "Boston, MA",
    period: "Sep 2025 – Dec 2025",
    tags: ["Leadership", "Mentorship", "Career Development"],
    bullets: [
      "Conducted mock interviews and provided personalized career guidance to graduate students, helping them prepare for technical interviews and job applications",
      "Facilitated regular office hours to support students in navigating master's program requirements and co-op search strategies",
      "Contributed to campus outreach initiatives to enhance student engagement and career readiness",
      "Developed and delivered presentation materials for incoming student orientation programs"
    ]
  },
  {
    title: "Business Data Analyst Intern",
    company: "Waste Management",
    location: "Hartford, CT",
    period: "May 2025 – Aug 2025",
    tags: ["Data Engineering", "Data Analysis", "Business Analytics"],
    bullets: [
      "Led $1M post-acquisition data integration with C-suite collaboration",
      "Migrated 500K+ records from GotJunk acquisition into Snowflake, ensuring data integrity across source systems",
      "Validated Snowflake ETL pipelines, resolving API mismatches, improving downstream analytics reliability by 25%",
      "Built automated data quality and validation checks, reducing errors in production pipelines by 25%",
      "Optimized SQL transformations and joins in Snowflake to improve pipeline performance by 30%",
      "Built reporting solutions for multiple WM vendors, enhancing dashboard speed by 30%",
    ]
  },
  {
    title: "Data Analyst Engineer Intern",
    company: "Formlabs",
    location: "Boston, MA",
    period: "Sep 2024 – Dec 2024",
    tags: ["Data Engineering", "Data Analysis", "Data Science", "Business Analytics"],
    bullets: [
      "Developed anomaly detection framework with SQL and Python, reduced operator work by 90%, cut costs 15%",
      "Built real-time dashboard in LookerStudio to track failures, enabling 20% yield increase through timely intervention",
      "Automated data ingestion and transformation pipelines using Python, SQL processing ~1M+ records",
      "Built reusable SQL scripts and Python validation routines to ensure data consistency across multiple systems",
      "Optimized SQL transformations to improve pipeline performance by 25%, supporting reporting teams",
      "Conducted A/B test analysis and presented to C-suite, enabling elimination of 5-min test and saving $25K annually"
    ]
  },
  {
    title: "Data Analytics Engineer",
    company: "Cognizant",
    location: "India",
    period: "Oct 2021 – Nov 2022",
    tags: ["Data Engineering", "Data Analysis", "Business Analytics"],
    bullets: [
      "Managed data migration of 1M+ insurance claims from Ironshore to Liberty Mutual using Informatica",
      "Implemented validation checks achieving 100% data accuracy across migrated records using SQL Server",
      "Optimized Informatica ETL workflows, reducing batch processing time by 40%",
      "Built automated SQL scripts for extraction, transformation, and validation across multiple systems",
      "Analyzed 100K+ customer transactions to identify behavioral segments, demand patterns, and churn signals"
    ]
  }
];

export const projectsData = [
  {
    id: 1,
    title: "RAG-Powered AI Knowledge Worker",
    description: "Built enterprise RAG system answering questions over 1,000+ internal documents using embeddings & hybrid search. Achieved 92% retrieval accuracy and reduced hallucinations by 40% through context-window optimization.",
    technologies: ["Python", "LangChain", "Chroma", "OpenAI API", "Gradio"],
    categories: ["LLM/Gen AI"],
    metrics: "92% retrieval accuracy, 40% reduction in hallucinations, sub-3s responses",
    github: "#",
    demo: "#"
  },
  {
    id: 2,
    title: "Multi-Modal Customer Support Agent",
    description: "Developed airline support agent handling text, images, and audio with robust function-calling workflows. Integrated GPT-4 and Claude for dynamic tools (booking, cancellation, baggage tracking, flight status).",
    technologies: ["Python", "LangChain", "OpenAI", "Claude", "Gradio"],
    categories: ["LLM/Gen AI"],
    metrics: "Reduced customer response time from 5 minutes to 15 seconds",
    github: "#",
    demo: "#"
  },
  {
    id: 3,
    title: "Autonomous Multi-Agent Deal Notification System",
    description: "Built multi-agent architecture (Scraper, Analyzer, Evaluator) collaborating to detect high-value deals. Achieved 95% deal validation accuracy with agent-to-agent communication monitoring 20+ e-commerce sites.",
    technologies: ["Python", "LangChain", "Agents SDK", "FastAPI"],
    categories: ["LLM/Gen AI"],
    metrics: "95% deal validation accuracy, real-time SMS/email alerts within 2 minutes",
    github: "#",
    demo: "#"
  },
  {
    id: 4,
    title: "Fine-Tuned E-commerce Price Prediction Model",
    description: "Fine-tuned LLaMA 3.2 on 50K+ product descriptions using QLoRA achieving 88% accuracy. Reduced GPU memory needs by 75% through 4-bit quantization & LoRA adapters.",
    technologies: ["HuggingFace", "LoRA/QLoRA", "LLaMA"],
    categories: ["LLM/Gen AI"],
    metrics: "88% accuracy, 75% GPU memory reduction, 95% lower inference cost",
    github: "#",
    demo: "#"
  },
  {
    id: 5,
    title: "Natural Language → SQL System",
    description: "Built NL2SQL system allowing users to query databases with English across 10+ file types and multiple SQL databases. Generated optimized SQL using semantic parsing (LangChain + LLaMA).",
    technologies: ["LangChain", "Llama 3.2", "Ollama", "Streamlit"],
    categories: ["LLM/Gen AI"],
    metrics: "100% elimination of manual SQL writing for non-technical users",
    github: "#",
    demo: "#"
  },
  {
    id: 6,
    title: "Databricks SaaS ETL Pipeline",
    description: "Orchestrated batch ETL pipelines in PySpark Databricks to ingest data from SaaS platform using Airflow. Implemented dbt transformations, automated validation, and CI/CD pipelines.",
    technologies: ["PySpark", "Python", "Git", "Databricks", "dbt", "Airflow"],
    categories: ["Data Engineering"],
    metrics: "50% error reduction through automation, scalable pipeline modules",
    github: "#",
    demo: "#"
  },
  {
    id: 7,
    title: "Streaming Transactional Finance Event Pipeline",
    description: "Developed real-time streaming pipeline processing 100K+/day finance transactions using Kafka and PySpark. Applied automated validation and transformation logic to enforce schema integrity.",
    technologies: ["Kafka", "PySpark", "Delta Lake", "Databricks CE", "Git"],
    categories: ["Data Engineering"],
    metrics: "Real-time processing of 100K+/day transactions, reliable querying with time-travel",
    github: "#",
    demo: "#"
  },
  {
    id: 8,
    title: "SaaS Customer Churn Prediction & Retention Modeling",
    description: "Built a LightGBM churn model achieving 85% precision to identify high-risk users and enable proactive retention interventions. Deployed real-time prediction API using FastAPI and Docker.",
    technologies: ["Python", "LightGBM", "FastAPI", "Docker", "dbt", "Airflow", "Tableau"],
    categories: ["Data Science"],
    metrics: "85% precision churn model, real-time prediction API, automated retraining",
    github: "#",
    demo: "#"
  },
  {
    id: 9,
    title: "Customer Behavior & Sales Insights Dashboard",
    description: "Performed customer segmentation analysis using purchase frequency, spend, and products across 50K+ transactions. Designed an interactive Tableau dashboard visualizing revenue, CLV, and churn risk.",
    technologies: ["SQL", "Excel", "Tableau"],
    categories: ["Data Analysis"],
    metrics: "18% underperforming SKUs identified, 7% margin increase, 12% forecasting accuracy improvement",
    github: "#",
    demo: "#"
  },
  {
    id: 10,
    title: "Marketing Campaign Performance Optimization",
    description: "Analyzed performance across email, paid ad, and referral campaigns, evaluating CAC, ROAS, funnel conversion/retention. Built a Power BI dashboard to provide real-time campaign insights.",
    technologies: ["SQL", "Python", "Power BI"],
    categories: ["Business Analytics"],
    metrics: "11.4% conversion improvement, 15% marketing ROI increase",
    github: "#",
    demo: "#"
  }
];

export const skillsData = {
  "Data Engineering": {
    languages: ["SQL", "Python"],
    tools: ["Airflow", "dbt", "Informatica", "Git", "CI/CD"],
    platforms: ["Snowflake", "AWS (Redshift, S3)", "Databricks", "Kafka", "Delta Lake"],
    databases: ["MySQL", "PostgreSQL", "MS SQL Server", "SQLite"]
  },
  "Data Science": {
    languages: ["Python", "SQL", "R"],
    ml: ["LightGBM", "Predictive Modeling", "Regression Analysis", "Time-Series Analysis"],
    deployment: ["FastAPI", "Docker"],
    visualization: ["Tableau"]
  },
  "LLM/Gen AI": {
    llms: ["OpenAI", "Claude", "Gemini", "LLaMA", "Mistral", "HuggingFace", "Ollama"],
    frameworks: ["LangChain", "OpenAI Agents SDK"],
    vectorDBs: ["Chroma", "Pinecone", "FAISS"],
    techniques: ["LoRA/QLoRA", "Model Evaluation", "Embeddings", "NLP Pipelines"],
    tools: ["FastAPI", "Streamlit", "Gradio", "Docker"]
  },
  "Data Analysis": {
    languages: ["SQL", "Python", "R"],
    analytics: ["A/B Testing", "Hypothesis Testing", "Cohort Analysis", "Time-Series"],
    visualization: ["Tableau", "Power BI", "Looker Studio", "Spotfire", "Excel"]
  },
  "Business Analytics": {
    tools: ["Tableau", "Power BI", "Looker Studio", "Spotfire", "Excel"],
    skills: ["Dashboard Design", "Data Storytelling", "Stakeholder Reporting", "Executive Communication", "Experiment Design"]
  }
};

export const educationData = [
  {
    degree: "Master of Science, Data Science",
    school: "Northeastern University",
    location: "Boston, MA",
    period: "Jan 2023 – Dec 2025",
    gpa: "3.96"
  },
  {
    degree: "Bachelor of Technology, Mechanical Engineering",
    school: "Vellore Institute of Technology",
    location: "India",
    period: "Jul 2017 – Jun 2021"
  }
];

export const certificationsData = [
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    year: "2024"
  }
];
