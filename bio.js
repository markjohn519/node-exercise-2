const { argv } = require('node:process')
const csvjson = require('csvjson')
const fs = require('fs')

const [,, flag, name, sex, age, height, weight] = argv

const readCSV = (filePath) => {
  const data = fs.readFileSync(`${__dirname}${filePath}`, { encoding: 'utf8' })
  const bioArr = csvjson.toColumnArray(data, { quote: true, delimiter: ',' })
  return bioArr
}
const writesCSV = (filePath, arr) => {
  const newData = fs.writeFileSync(filePath, arr, { encoding: 'utf8', flag: 'w' })
  if (fs.existsSync(!filePath)) return console.log(false)
  console.log(true)
  return newData
}
const bioObject = (arr, position) => {
  const newObj = {
    name: arr.name[position],
    sex: arr.sex[position],
    age: arr.age[position],
    height: arr.height[position],
    weight: arr.weight[position],
  }
  return newObj
}
const createBio = (arr, parName, parSex, parAge, parHeight, parWeight) => {
  arr.name.push(parName)
  arr.sex.push(parSex)
  arr.age.push(parAge)
  arr.height.push(parHeight)
  arr.weight.push(parWeight)
  const newArrBio = arr
  const arrayLikeObjBio = []
  const latestArrBio = []
  latestArrBio.push(Object.keys(newArrBio))
  newArrBio.name.forEach((_value, index) => {
    arrayLikeObjBio.push(bioObject(newArrBio, index))
    latestArrBio.push(Object.values(arrayLikeObjBio[index]))
  })
  const lastestStringArr = latestArrBio.join('\n').toString()
  writesCSV('biostats.csv', lastestStringArr)
}
const readBio = (arr, parName) => {
  const findName = arr.name.indexOf(parName)
  if (findName === -1) {
    return null
  }
  return bioObject(arr, findName)
}
const updateBio = (arr, parName, parSex, parAge, parHeight, parWeight) => {
  const findName = arr.name.indexOf(parName)
  arr.sex.splice(findName, 1, parSex)
  arr.age.splice(findName, 1, parAge)
  arr.height.splice(findName, 1, parHeight)
  arr.weight.splice(findName, 1, parWeight)
  const updatedArrBio = arr
  const arrayLikeObjBio = []
  const latestArrBio = []
  latestArrBio.push(Object.keys(updatedArrBio))
  updatedArrBio.name.forEach((_value, index) => {
    arrayLikeObjBio.push(bioObject(updatedArrBio, index))
    latestArrBio.push(Object.values(arrayLikeObjBio[index]))
  })
  const lastestStringArr = latestArrBio.join('\n').toString()
  writesCSV('biostats.csv', lastestStringArr)
}
const deleteBio = (arr, parName) => {
  const findName = arr.name.indexOf(parName)
  arr.name.splice(findName, 1)
  arr.sex.splice(findName, 1)
  arr.age.splice(findName, 1)
  arr.weight.splice(findName, 1)
  arr.height.splice(findName, 1)
  const deletedArrBio = arr
  const arrayLikeObjBio = []
  const latestArrBio = []
  latestArrBio.push(Object.keys(deletedArrBio))
  deletedArrBio.name.forEach((_value, index) => {
    arrayLikeObjBio.push(bioObject(deletedArrBio, index))
    latestArrBio.push(Object.values(arrayLikeObjBio[index]))
  })
  const lastestStringArr = latestArrBio.join('\n').toString()
  writesCSV('biostats.csv', lastestStringArr)
}
switch (flag) {
  case '-c': {
    const name1 = name.toLowerCase()
    const nameInsensitive = name1.charAt(0).toUpperCase() + name1.slice(1)
    const condition1 = flag === undefined || name === undefined || sex === undefined
    const condition2 = height === undefined || weight === undefined
    if (condition1 || condition2) {
      console.log('All argument should be complete in Create Bio')
      process.exit(1)
    } else if (readBio(readCSV('/biostats.csv'), nameInsensitive, sex.toUpperCase()) !== null) {
      console.log(`Name ${name} already exist.`)
      process.exit(1)
    } else if (!['m', 'M', 'f', 'F'].includes(sex)) {
      console.log('Put "f", "F", "m" and "M" only.')
      process.exit(1)
    } else if (age < 18 || Number.isNaN(Number(age))) {
      console.log('Only 18 and above is accepted and Number Only.')
      process.exit(1)
    } else if (Number.isNaN(Number(height))) {
      console.log('Height shoud be a number.')
      process.exit(1)
    } else if (Number.isNaN(Number(weight))) {
      console.log('Weight shoud be a number.')
      process.exit(1)
    }
    createBio(readCSV('/biostats.csv'), nameInsensitive, sex.toUpperCase(), age, height, weight)
    break
  }
  case '-r': {
    const name1 = name.toLowerCase()
    const nameInsensitive = name1.charAt(0).toUpperCase() + name1.slice(1)
    if (flag === undefined || name === undefined) {
      console.log('Name argument should not be emty to View Bio')
      process.exit(1)
    } else if (sex !== undefined) {
      console.log('Only Flag and Name should be entered')
      process.exit(1)
    } else if (readBio(readCSV('/biostats.csv'), nameInsensitive) !== null) {
      const read = readBio(readCSV('/biostats.csv'), nameInsensitive)
      console.log(`\n Name   : ${read.name}\n Sex    : ${read.sex === 'M' ? 'Male' : 'Female'}\n Age    : ${read.age}\n Height : ${read.height * 2.54}\n Weight : ${read.weight / 2.2046} \n`)
      process.exit(1)
    } else console.log(`Name "${name}" doesn't exist.`)
  }
    break
  case '-u': {
    const name1 = name.toLowerCase()
    const nameInsensitive = name1.charAt(0).toUpperCase() + name1.slice(1)
    if (flag === undefined || name === undefined || sex === undefined) {
      console.log('All argument should be complete in Create Bio')
      process.exit(1)
    } else if (!['m', 'M', 'f', 'F'].includes(sex)) {
      console.log('Put "f", "F", "m" and "M" only.')
      process.exit(1)
    } else if (age < 18 || Number.isNaN(Number(age))) {
      console.log('Only 18 and above is accepted and Number Only.')
      process.exit(1)
    } else if (Number.isNaN(Number(height))) {
      console.log('Height shoud be a number.')
      process.exit(1)
    } else if (Number.isNaN(Number(weight))) {
      console.log('Weight shoud be a number.')
      process.exit(1)
    }
    updateBio(readCSV('/biostats.csv'), nameInsensitive, sex.toUpperCase(), age, height, weight)
  }
    break
  case '-d': {
    const name1 = name.toLowerCase()
    const nameInsensitive = name1.charAt(0).toUpperCase() + name1.slice(1)
    if (flag === undefined || name === undefined) {
      console.log('Name argument should not be emty to View Bio')
      process.exit(1)
    } else if (sex !== undefined) {
      console.log('Only Flag and Name should be entered')
      process.exit(1)
    } else if (readBio(readCSV('/biostats.csv'), nameInsensitive) !== null) {
      deleteBio(readCSV('/biostats.csv'), nameInsensitive)
      console.log(`deleted ${name}`)
      process.exit(1)
    } else console.log(`Name "${name}" doesn't exist.`)
  }
    break
  default:
    console.log(`Your input "${flag}" is not allowed. Use only from -c, -r, -u, and -d.`)
}
