module.exports.extractUefsEmployeeData = function (data) {
  /**
   * 
   * [4] => nome
   * [5] => cargo
   * [6] => email
  */
  return {
    name: data[4],
    linkType: isTeacher(data[5]) ? 'faculty' : 'staff',
    email: data[6]
  }
}

function isTeacher (linkType = '') {
  return linkType.toLowerCase().includes('professor')
}