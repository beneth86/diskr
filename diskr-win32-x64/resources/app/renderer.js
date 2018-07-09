// Require Dependencies
const $ = require('jquery');
const powershell = require('node-powershell');
const dt = require('datatables.net')();
const dtbs = require('datatables.net-bs4')(window, $);

// Testing PowerShell
$("#getDisk").click(() => {

    // Clear the Error Messages
    $('.alert-danger .message').html()
    $('.alert-danger').hide()

    // Get the form input or default to 'localhost'
    let computer = $('#computerName').val() || 'localhost'

    // Create the PS Instance
    let ps = new powershell({
        executionPolicy: 'Bypass',
        noProfile: true
    })

    // Load the gun
    let scriptPath = require("path").resolve(__dirname, './Get-Drives.ps1')
    ps.addCommand(scriptPath, [
        { ComputerName: computer }
    ])

    // Pull the Trigger
    ps.invoke()
    .then(output => {
        console.log(output)
        let data = JSON.parse(output)
        console.log(data)

        // Generate DataTables columns dynamically
        let columns = []
        Object.keys(data[0]).forEach( key => columns.push({ title: key, data: key }) )

        // Create DataTable
        $('#output').DataTable({
            data: data,
            columns: columns,
            paging: false,
            searching: false,
            info: false,
            destroy: true // or retrieve: true
        });
    })
    .catch(err => {
        console.error(err)
        $('.alert-danger .message').html(err)
        $('.alert-danger').show()
        ps.dispose()
    })

})