const enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");

enzyme.configure({ adapter: new Adapter() });

// Make sure any console.error calls from React results in an error
const errorReporter = jest.spyOn(console, "error");
errorReporter.mockImplementation((error) => { throw error });
