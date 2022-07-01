const { performQuery } = require('../utils/dbModule');

// Returns an array that represents the muscleGroup enum.
const getMuscleGroups = async () => {
    const res = await performQuery('SELECT enum_range(NULL::musclegroup)');
    const enumString = res.rows[0].enum_range;
    const enumArray = enumString.substring(1, enumString.length - 1).split(',');
    return enumArray;
}

// TODO: change map result
// Returns a map {exercise : muscleGroup} that represents the Exercise enum.
// Exercises are stored in the string format "exercise:muscleGroup" in the Exercise enum, hence the reformatting into a map.
const getExerciseMap = async () => {
    const res = await performQuery('SELECT name, musclegroup FROM exercises');
    const map = new Map();
    for (let pair of res.rows) {
        map.set(pair.name, pair.musclegroup);
    }
    return map;
}

// Returns the Exercise enum as an array and without their corresponding muscleGroups.
const getExercisesArray = async () => {
    const map = await getExerciseMap();
    return Array.from(map.keys());
}

const test = async () => {
    const muscleGroups = await getMuscleGroups();
    const exerciseMap = await getExerciseMap();
    const getExercisesArray = await getExercisesArray();
    console.log(muscleGroups);
    console.log(exerciseMap);
    console.log(getExercisesArray);
}

//test();

module.exports.getMuscleGroups = getMuscleGroups;
module.exports.getExerciseMap = getExerciseMap;
module.exports.getExercisesArray = getExercisesArray;
