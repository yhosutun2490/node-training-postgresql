const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name: "Course",
    tableName: "Course",
    columns: {
      id: {
        primary: true,
        type: "uuid",
        generated: "uuid",
        nullable: false,
      },
      name: {
        type: "varchar",
        length: 100,
        nullable: false
      },
      description: {
        type: "text",
        nullable: false
      },
      start_at: {
        type: 'timestamp',
        nullable: false
      },
      end_at: {
        type: 'timestamp',
        nullable: false
      },
      max_participants: {
        type: 'integer',
        nullable: false
      },
      meeting_url: {
        type: "varchar",
        length: 2048,
        nullable: false
      },
      create_at: {
        type: "timestamp",
        createDate: true,
        nullable: false
      },
      update_at: {
        type: "timestamp",
        updateDate: true,
        nullable: false
      },
    } ,
    relations: {
      user: {
        target: 'User',
        type: 'many-to-one',
        joinColumn: {
            name: "user_id", // FK
        },
        inverseSide: "courses",
      },
      courseBookings: {
        target: "CourseBooking",
        type: "one-to-many",
        inverseSide: "course",
      },
      coachLinkSkills: {
        target: 'CoachSLinkSkill',
        type: "many-to-one",
        joinColumn: {
          name: "skill_id", // FK name
        },
        inverseSide: "courses",
      }
    }
  })