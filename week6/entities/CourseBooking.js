const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name: "CourseBooking",
    tableName: "COURSE_BOOKING",
    columns: {
      id: {
        primary: true,
        type: "uuid",
        generated: "uuid",
        nullable: false,
      },
      booking_at: {
        type: "timestamp",
        nullable: false
      },
      status: {
        type: 'varchar',
        length: 20,
        nullable: false
      },
      join_at: {
        type: "timestamp",
        nullable: true
      },
      leave_at: {
        type: "timestamp",
        nullable: true
      },
      cancelled_at: {
        type: "timestamp",
        nullable: true
      },
      cancellation_reason: {
        type: "varchar",
        length: 255,
        nullable: true
      },
      create_at: {
        type: "timestamp",
        createDate: true,
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
        inverseSide: "courseBookings",
      },
      courses: {
        target: 'Course',
        type: 'many-to-one',
        joinColumn: {
            name: "course_id", // FK
        },
        inverseSide: "courseBookings",
      }

    }
  })