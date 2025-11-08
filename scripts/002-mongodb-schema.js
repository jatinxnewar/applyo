// Just switch to the desired database
this.getSiblingDB("applyo").createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["auth0_id", "email", "created_at"],
      properties: {
        _id: { bsonType: "objectId" },
        auth0_id: { bsonType: "string", description: "Auth0 unique identifier" },
        email: { bsonType: "string", description: "User email address" },
        name: { bsonType: "string", description: "User full name" },
        picture: { bsonType: "string", description: "User profile picture URL" },
        user_type: {
          enum: ["student", "professional", "employer"],
          description: "Type of user account",
        },
        bio: { bsonType: "string", description: "User bio" },
        location: { bsonType: "string", description: "User location" },
        phone: { bsonType: "string", description: "User phone number" },
        social_links: {
          bsonType: "object",
          properties: {
            linkedin: { bsonType: "string" },
            github: { bsonType: "string" },
            portfolio: { bsonType: "string" },
          },
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" },
      },
    },
  },
})

this.getSiblingDB("applyo").createCollection("resumes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["user_id", "title", "created_at"],
      properties: {
        _id: { bsonType: "objectId" },
        user_id: { bsonType: "objectId", description: "Reference to users._id" },
        title: { bsonType: "string" },
        template: {
          enum: ["modern", "classic", "minimalist", "creative"],
          description: "Resume template type",
        },
        personal_info: {
          bsonType: "object",
          properties: {
            full_name: { bsonType: "string" },
            email: { bsonType: "string" },
            phone: { bsonType: "string" },
            location: { bsonType: "string" },
            summary: { bsonType: "string" },
          },
        },
        experience: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              company: { bsonType: "string" },
              position: { bsonType: "string" },
              start_date: { bsonType: "date" },
              end_date: { bsonType: "date" },
              current: { bsonType: "bool" },
              description: { bsonType: "string" },
            },
          },
        },
        education: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              school: { bsonType: "string" },
              degree: { bsonType: "string" },
              field: { bsonType: "string" },
              graduation_date: { bsonType: "date" },
              gpa: { bsonType: "string" },
            },
          },
        },
        skills: {
          bsonType: "array",
          items: { bsonType: "string" },
        },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" },
      },
    },
  },
})

this.getSiblingDB("applyo").createCollection("job_postings", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["employer_id", "title", "description", "created_at"],
      properties: {
        _id: { bsonType: "objectId" },
        employer_id: { bsonType: "objectId", description: "Reference to users._id" },
        title: { bsonType: "string" },
        description: { bsonType: "string" },
        company: { bsonType: "string" },
        location: { bsonType: "string" },
        salary_min: { bsonType: "int" },
        salary_max: { bsonType: "int" },
        currency: { bsonType: "string" },
        job_type: { enum: ["full-time", "part-time", "contract", "freelance"] },
        status: { enum: ["open", "closed", "draft"], default: "open" },
        required_skills: { bsonType: "array", items: { bsonType: "string" } },
        experience_level: { enum: ["entry", "mid", "senior"] },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" },
      },
    },
  },
})

this.getSiblingDB("applyo").createCollection("applications", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["applicant_id", "job_id", "created_at"],
      properties: {
        _id: { bsonType: "objectId" },
        applicant_id: { bsonType: "objectId", description: "Reference to users._id" },
        job_id: { bsonType: "objectId", description: "Reference to job_postings._id" },
        resume_id: { bsonType: "objectId", description: "Reference to resumes._id" },
        cover_letter: { bsonType: "string" },
        status: {
          enum: ["submitted", "reviewed", "shortlisted", "accepted", "rejected"],
          default: "submitted",
        },
        ats_score: { bsonType: "double" },
        notes: { bsonType: "string" },
        created_at: { bsonType: "date" },
        updated_at: { bsonType: "date" },
      },
    },
  },
})

// Create indexes for optimal performance
this.getSiblingDB("applyo").users.createIndex({ auth0_id: 1 }, { unique: true })
this.getSiblingDB("applyo").users.createIndex({ email: 1 }, { unique: true })
this.getSiblingDB("applyo").resumes.createIndex({ user_id: 1 })
this.getSiblingDB("applyo").job_postings.createIndex({ employer_id: 1 })
this.getSiblingDB("applyo").job_postings.createIndex({ status: 1 })
this.getSiblingDB("applyo").applications.createIndex({ applicant_id: 1 })
this.getSiblingDB("applyo").applications.createIndex({ job_id: 1 })
this.getSiblingDB("applyo").applications.createIndex({ applicant_id: 1, job_id: 1 }, { unique: true })

console.log("MongoDB schema created successfully!")
