const { argv } = require('node:process')
const csvjson = require('csvjson')
const fs = require('fs')

const [,, flag, inputName, inputSex, inputAge, inputHeight, inputWeight] = argv
const fileCSV = 'biostats2.csv'
class BioStat {
  constructor(name, sex, age, height, weight) {
    this.name = name
    this.sex = sex
    this.age = Number(age)
    this.height = Number(height)
    this.weight = Number(weight)
  }
}
const createBioStat = (name, sex, age, height, weight) => {
  const newBioSat = new BioStat(name, sex, age, height, weight)
  return newBioSat
}
const readCSV = (filePath) => {
  const data = fs.readFileSync(filePath, { encoding: 'utf8' })
  const bioObj = csvjson.toObject(data, { quote: true, delimiter: ',' })
  const bioArr = csvjson.toColumnArray(data, { quote: true, delimiter: ',' })
  const mapStats = new Map()
  bioArr.name.forEach((value, index) => {
    mapStats.set(value, bioObj[index])
  })
  return mapStats
}
const writesCSV = (filePath, updateMap) => {
  if (fs.existsSync(!filePath)) return console.log(false)
  const convertedArr = Array.from(updateMap.values())
  fs.writeFileSync(
    filePath,
    csvjson.toCSV(convertedArr, { delimiter: ',', quote: '"', headers: 'key' }),
    { encoding: 'utf-8' },
  )
  return true
}
const createBio = (oldStat, newStat) => {
  const keyName = newStat.name
  const newMapStats = oldStat.set(keyName, newStat)
  return newMapStats
}
const readBio = (oldStat, personStat) => {
  const keyName = personStat.name
  const findName = oldStat.get(keyName)
  return findName
}
const updateBio = (oldStat, person) => {
  const keyName = person.name
  return oldStat.set(keyName, {
    ...oldStat.get(keyName),
    sex: person.sex,
    age: person.age,
    height: person.height,
    weight: person.weight,
  })
}
const deleteBio = (oldStat, personStat) => {
  const keyName = personStat.name
  oldStat.delete(keyName)
  return oldStat
}
const nameInsensitive = (parNameInsensitive) => {
  const name1 = parNameInsensitive.toLowerCase()
  const name = name1.charAt(0).toUpperCase() + name1.slice(1)
  return name
}
const oldStats = readCSV(fileCSV)
const inputNameInsensitive = nameInsensitive(inputName)
const newBioStats = createBioStat(
  inputNameInsensitive,
  inputSex,
  inputAge,
  inputHeight,
  inputWeight,
)
const personData = readBio(oldStats, newBioStats)

const completeAllInput = () => {
  const condition1 = inputName === undefined || inputSex === undefined
  const condition2 = inputHeight === undefined || inputWeight === undefined
  if (condition1 || condition2) {
    console.log('All argument should be complete in Create Bio')
    process.exit(1)
  }
}
const checkName = (oldstat, parNameInsensitive) => {
  if (oldstat.has(parNameInsensitive)) {
    console.log(`Name "${inputName}" already exist.`)
    process.exit(1)
  }
}
const checkSexInput = () => {
  if (!['m', 'M', 'f', 'F'].includes(inputSex)) {
    console.log('Put "f", "F", "m" and "M" only.')
    process.exit(1)
  }
}
const checkAge = () => {
  if (inputAge < 18 || Number.isNaN(Number(inputAge))) {
    console.log('Only 18 above is accepted and Number Only.')
    process.exit(1)
  }
}
const checkNumber = () => {
  if (Number.isNaN(Number(inputHeight))) {
    console.log('Height shoud be a number.')
    process.exit(1)
  }
  if (Number.isNaN(Number(inputWeight))) {
    console.log('Weight shoud be a number.')
    process.exit(1)
  }
}
const undefinedName = () => {
  if (inputName === undefined) {
    console.log('Name argument should not be emty to View Bio')
    process.exit(1)
  }
}
const nameExist = (name) => {
  if (oldStats.has(name) === false) {
    console.log(`This name "${inputName}" doesn't exist`)
    process.exit()
  }
}
switch (flag) {
  case '-c':
    completeAllInput()
    checkName(oldStats, nameInsensitive(inputName))
    checkSexInput()
    checkAge()
    checkNumber()
    writesCSV(fileCSV, createBio(oldStats, newBioStats))
    console.log(`Created new BioStat for ${inputName}`)
    break
  case '-r':
    undefinedName()
    nameExist(inputNameInsensitive)
    console.log(`
  Name   : ${personData.name}
  Sex    : ${personData.sex === 'M' ? 'Male' : 'Female'}
  Age    : ${personData.age}
  Height : ${personData.height} inches and ${(personData.height * 2.54).toFixed(2)} centimeters
  Weight : ${personData.weight} pounds and  ${(personData.weight / 2.2046).toFixed(2)} kilos
  `)
    break
  case '-u':
    completeAllInput()
    nameExist(inputNameInsensitive)
    checkSexInput()
    checkAge()
    checkNumber()
    writesCSV(fileCSV, updateBio(oldStats, newBioStats))
    console.log(`Succesfully updated ${inputNameInsensitive}`)
    break
  case '-d':
    undefinedName()
    nameExist(inputNameInsensitive)
    writesCSV(fileCSV, deleteBio(oldStats, newBioStats))
    console.log(`Succesfully deleted "${inputNameInsensitive}"`)
    break
  default:
    console.log(`Your input "${flag}" is not allowed. Use only from -c, -r, -u, and -d.`)
}
