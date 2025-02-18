const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name: "User",
    tableName: "User",
    columns: {
      id: {
        primary: true,
        type: "uuid",
        generated: "uuid",
        nullable: false,
      },
      name: {
        type: "varchar",
        length: 50,
        unique: true,
        nullable: false
      },
      email: {
        type: "varchar",
        length: 320,
        unique: true,
        nullable: false
      },
      role: {
        type: "varchar",
        length: 20,
        nullable: false
      },
      password: {
        type: "varchar",
        length: 72,
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
      }
    },
    relations: {
      Coach: {
        target: "Coach",
        type: "one-to-one",
        joinColumn: {
          name: "user_id",
        },
        inverseSide: "user",
      },
      CreditPurchases: {
        target: "CreditPurchase",
        type: "one-to-many",
        inverseSide: "user",
      },
      Course: {
        target: "Course",
        type: "one-to-many",
        inverseSide: "user",
      },
      CourseBookings: {
        target: "CourseBooking",
        type: "one-to-many",
        inverseSide: "user",
      },
    }
  })