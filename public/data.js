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
      "Conducted mock interviews and guided graduate students in technical interview and job preparation",
      "Held regular office hours to support students with program requirements and co-op strategies",
      "Hosted 5+ podcasts with industry guests, providing career insights and networking opportunities",
      "Developed and delivered presentation materials for incoming student orientation"
    ]
  },
  {
    title: "Business Data Analyst",
    company: "Waste Management",
    location: "Hartford, CT",
    period: "May 2025 – Aug 2025 (Internship)",
    tags: ["Data Engineering", "Data Analysis", "Business Analytics"],
    bullets: [
      "Led $1M post-acquisition data integration with C-suite collaboration",
      "Migrated 500K+ GotJunk records into Snowflake, ensuring data integrity across source systems",
      "Validated ETL pipelines and resolved API mismatches, boosting analytics reliability by 25%",
      "Optimized SQL transformations and joins in Snowflake, improving pipeline performance and dashboard usability by 30%"
    ]
  },
  {
    title: "Data Analyst Engineer",
    company: "Formlabs",
    location: "Boston, MA",
    period: "Sep 2024 – Dec 2024 (Co-op)",
    tags: ["Data Engineering", "Data Analysis", "Data Science", "Business Analytics"],
    bullets: [
      "Developed an anomaly detection framework with SQL and Python, cutting operator workload by 90% and costs by 15%",
      "Built a real-time LookerStudio dashboard, boosting yield by 20% through timely failure tracking",
      "Automated data pipelines with Python, SQL, and BigQuery, processing 1M+ records efficiently",
      "Created reusable SQL scripts and Python routines to ensure data consistency across systems",
      "Conducted A/B tests and presented results to C-suite, eliminating a 5-minute test and saving $25K"
    ]
  },
  {
    title: "Data Analytics Engineer",
    company: "Cognizant",
    location: "India",
    period: "Oct 2021 – Nov 2022",
    tags: ["Data Engineering", "Data Analysis", "Business Analytics"],
    bullets: [
      "Managed migration of 1M+ insurance claims from Ironshore to Liberty Mutual using Informatica, ensuring data integrity",
      "Implemented SQL Server validation checks, achieving 100% accuracy across migrated records",
      "Optimized Informatica ETL workflows, reducing batch processing time by 40% and improving downstream analytics",
      "Built automated SQL scripts for ETL and validation across systems, streamlining recurring processes",
      "Analyzed 100K+ customer transactions to identify behavioral segments, demand patterns, and churn signals"
    ]
  },
  {
    title: "Supply Chain Analyst",
    company: "Sundaram Fasteners Limited",
    location: "India",
    period: "Feb 2021 – Jun 2021 (Internship)",
    tags: ["Supply Chain", "Data Analysis", "Simulation", "Research"],
    bullets: [
      "Conducted research on reverse supply chain optimization for remanufacturing operations, published in Environment, Development and Sustainability (Springer)",
      "Built discrete-event simulation models using Arena to analyze 500K+ return scenarios and optimize international logistics between Germany/USA and India",
      "Performed statistical analysis, goodness-of-fit testing, and distribution analysis on transportation data",
      "Developed process and cost optimization framework, reducing per-container costs by ~$50K",
      "Read the publication <a href=\"https://mahadharsan.netlify.app/publications\" target=\"_blank\" rel=\"noopener noreferrer\">here</a>"
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
    github: "https://github.com/mahadharsan/Finance-RAG",
    demo: "#"
  },
  {
    id: 2,
    title: "Natural Language → SQL System",
    description: "Built NL2SQL system allowing users to query databases with English across 10+ file types and multiple SQL databases. Generated optimized SQL using semantic parsing (LangChain + LLaMA).",
    technologies: ["LangChain", "Llama 3.2", "Ollama", "Streamlit"],
    categories: ["LLM/Gen AI"],
    metrics: "100% elimination of manual SQL writing for non-technical users",
    github: "https://github.com/mahadharsan/English-to-SQL-system-app",
    demo: "#"
  },
  {
    id: 3,
    title: "Customer Behavior & Sales Insights Dashboard",
    description: "Performed customer segmentation analysis using purchase frequency, spend, and products across 50K+ transactions. Designed an interactive Tableau dashboard visualizing revenue, CLV, and churn risk.",
    technologies: ["SQL", "Excel", "Tableau"],
    categories: ["Data Analysis"],
    metrics: "18% underperforming SKUs identified, 7% margin increase, 12% forecasting accuracy improvement",
    github: "#",
    demo: "#"
  },
  {
    id: 4,
    title: "Marketing Campaign Performance Optimization",
    description: "Analyzed performance across email, paid ad, and referral campaigns, evaluating CAC, ROAS, funnel conversion/retention. Built a Power BI dashboard to provide real-time campaign insights.",
    technologies: ["SQL", "Python", "Power BI"],
    categories: ["Data Analysis"],
    metrics: "11.4% conversion improvement, 15% marketing ROI increase",
    github: "#",
    demo: "#"
  },
  {
    id: 5,
    title: "Databricks SaaS ETL Pipeline",
    description: "Orchestrated batch ETL pipelines in PySpark Databricks to ingest data from SaaS platform using Airflow. Implemented dbt transformations, automated validation, and CI/CD pipelines.",
    technologies: ["PySpark", "Python", "Git", "Databricks", "dbt", "Airflow"],
    categories: ["Data Engineering"],
    metrics: "50% error reduction through automation, scalable pipeline modules",
    github: "#",
    demo: "#"
  },
  {
    id: 6,
    title: "SaaS Customer Churn Prediction & Retention Modeling",
    description: "Built a LightGBM churn model achieving 85% precision to identify high-risk users and enable proactive retention interventions. Deployed real-time prediction API using FastAPI and Docker.",
    technologies: ["Python", "LightGBM", "FastAPI", "Docker", "dbt", "Airflow", "Tableau"],
    categories: ["Data Science"],
    metrics: "85% precision churn model, real-time prediction API, automated retraining",
    github: "#",
    demo: "#"
  },
  {
    id: 7,
    title: "H1B Visa Sponsorship Analytics (2023-2025)",
    description: "Engineered an end-to-end ELT pipeline processing 200k raw records (1.2M applications). Implemented regex-based Entity Resolution via dbt to consolidate 1k+ fragmented employer names.",
    technologies: ["Postgres", "Airbyte", "BigQuery", "PySpark", "dbt", "Looker Studio"],
    categories: ["Data Engineering", "Data Analysis"],
    metrics: "200k records processed, 1k+ employer names consolidated",
    github: "https://github.com/mahadharsan/h1b-data-analytics-engineering-pipeline",
    demo: "h1b-dashboard.html"
  }
];

export const skillsData = {
  "Data Analysis": {
    languages: ["SQL", "Python", "R"],
    analytics: ["A/B Testing", "Hypothesis Testing", "Cohort Analysis", "Time-Series"],
    visualization: ["Tableau", "Power BI", "Looker Studio", "Spotfire", "Excel"]
  },
  "Data Engineering": {
    languages: ["SQL", "Python"],
    tools: ["Airflow", "dbt", "Informatica", "Git", "CI/CD"],
    platforms: ["Snowflake", "PostgreSQL","Google Cloud Platform", "AWS (Redshift, S3)", "Databricks", "Delta Lake"],
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
    gpa: "3.97"
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

export const blogData = [
  {
    title: "Introduction to ARIMA: How I Gained Intuition Behind it",
    url: "https://dev.to/maha_data/how-i-gained-the-intuition-behind-the-arima-model-36a0",
    platform: "dev.to",
    date: "Mar 27, 2025",
    excerpt: "Exploring forecasting techniques with a focus on ARIMA, a powerful time series prediction model. Building a strong foundation by covering types of forecasting, stationarity, quantitative methods, and breaking down ARIMA components step by step."
  },
  {
    title: "Your Programming Skills Aren't Disappearing, Your Brain Is Just Being Efficient",
    url: "https://medium.com/@maha_dharsan/your-programming-skills-arent-disappearing-your-brain-is-just-being-efficient-e7f498aba52e",
    platform: "Medium",
    date: "2025",
    excerpt: "Understanding how your brain works when learning programming and why it might feel like you're forgetting things, when actually your brain is optimizing for efficiency."
  }
];

export const publicationsData = [
  {
    title: "Resilience strategies to recover from the cascading ripple effect in a copper supply chain through project management",
    authors: "V KEk, SP Nadeem, M Ravichandran, M Ethirajan, J Kandasamy",
    venue: "Operations Management Research 15 (1), 440-460",
    year: "2022",
    url: "https://link.springer.com/article/10.1007/s12063-021-00231-x",
    citations: 38
  },
  {
    title: "Environment and economic analysis of reverse supply chain scenarios for remanufacturing using discrete-event simulation approach",
    authors: "M Ravichandran, KEK Vimal, V Kumar, O Kulkarni, S Govindaswamy",
    venue: "Environment, Development and Sustainability 26 (4), 10183-10224",
    year: "2024",
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=oUNyeYMAAAAJ&citation_for_view=oUNyeYMAAAAJ:zYLM7Y9cAGgC",
    citations: 16
  },
  {
    title: "Supply chain routing in a diary industry using heterogeneous fleet system: simulation-based approach",
    authors: "M Ravichandran, R Naresh, J Kandasamy",
    venue: "Journal of The Institution of Engineers (India): Series C 101 (5), 891-911",
    year: "2020",
    url: "https://link.springer.com/article/10.1007/s40032-020-00588-1",
    citations: 14
  },
  {
    title: "Application of multi grade fuzzy approach to compute the circularity index of manufacturing organizations",
    authors: "KEK Vimal, AK Kulatunga, M Ravichandran, J Kandasamy",
    venue: "Procedia CIRP 98, 476-481",
    year: "2021",
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=oUNyeYMAAAAJ&citation_for_view=oUNyeYMAAAAJ:d1gkVwhDpl0C",
    citations: 13
  },
  {
    title: "Application of dmaic to reduce the rejection rate of starter motor shaft assembly in the automobile industry: a case study",
    authors: "G Sundaramali, RK Santhosh, S Anirudh, R Mahadharsan, SK Selvaraj",
    venue: "International Journal of Industrial Engineering and Production Research 32, 1-18",
    year: "2021",
    url: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=oUNyeYMAAAAJ&citation_for_view=oUNyeYMAAAAJ:Tyk-4Ss8FVUC",
    citations: 8
  },
  {
    title: "A QFD Approach for Selection of Design for Logistics Strategies",
    authors: "M Ravichandran, KEK Vimal, K Jayakrishna, AK Kulatunga",
    venue: "Design for Tomorrow—Volume 2: Proceedings of ICoRD 2021, 141-149",
    year: "2021",
    url: "https://link.springer.com/chapter/10.1007/978-981-16-0119-4_12",
    citations: 3
  }
];
