const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
    name: "CoachLinkSkill",
    tableName: "Coach_Link_Skill",
    columns: {
      id: {
        primary: true,
        type: "uuid",
        generated: "uuid",
        nullable: false,
      },
      create_at: {
        type: "timestamp",
        createDate: true,
        nullable: false
      },
    } ,
    relations: {
      coach: {
        target: 'Coach',
        type: 'many-to-one',
        joinColumn: {
            name: "coach_id", // FK
        },
        inverseSide: "coachLinkSkills",
      },
      skill: {
        target: 'CoachSkill',
        type: "many-to-one",
        joinColumn: {
          name: "skill_id", // FK name
        },
        inverseSide: "coachLinkSkills",
      },
      courses: {
        target: 'Course',
        type: 'one-to-many',
        joinColumn: {
            name: "skill_id", // FK
        },
        inverseSide: "coachLinkSkills",
      },
    }
  })