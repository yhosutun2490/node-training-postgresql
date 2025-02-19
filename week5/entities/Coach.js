const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name: "Coach",
    tableName: "Coach",
    columns: {
      id: {
        primary: true,
        type: "uuid",
        generated: "uuid",
        nullable: false,
      },
      user_id: {
        primary: true,
        type: "uuid",
        generated: "uuid",
        nullable: false,
      },
      experience_years: {
        type: "integer",
        nullable: false
      },
      description: {
        type: "varchar",
        nullable: false
      },
      profile_image_url: {
        type: "varchar",
        length: 2048,
        nullable: true
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
    },
    relations: {
      User: {
        target: 'User',
        type: 'one-to-one',
        inverseSide: 'Coach',
        joinColumn: {
          name: 'user_id',
          referencedColumnName: 'id',
          foreignKeyConstraintName: 'coach_user_id_fk'
        }
      }
    }
  })