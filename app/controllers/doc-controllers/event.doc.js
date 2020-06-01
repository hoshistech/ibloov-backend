/**
 * @api {get} /event
 * @apiGroup Event
 * @apiVersion 0.1.0
 * @apiDescription API to retrive events .
 * @apiHeader {string} Accept application/json.
 * @apiName GetEvents
 *
 *
 *  @apiSuccessExample {json} Success
 *HTTP/1.1 200 OK
 * {
 *  "success": "true",
 *  "message": "events reterived successfully",
 *  "data": []
 * }
 */
index = async (req, res) => {},


/**
 * @api {post} /event
 * @apiGroup Event
 * @apiVersion 0.1.0
 * @apiDescription API to create a single event instance .
 * @apiHeader {string} Accept application/json.
 * @apiHeader {string} Token xxxxxxx.
 * @apiName CreateEvents
 *
 *
 *  @apiSuccessExample {json} Success
 *HTTP/1.1 200 OK
 * {
 *  "success": "true",
 *  "message": "events created successfully",
 *  "data": []
 * }
 */
create = async (req, res) => {};


update = async (req, res) => {};


view = async (req, res) => {};


softdelete = async (req, res) => {};


generateEventCode = (req, res) => {}


follow = async (req, res) => {},


muteNotifications = async (req, res) => {},


unfollow = async (req, res) => {
    
},


confirmAttendance = async (req, res) => {}


generateCode = () => {

    return Math.random().toString(36).slice(3);
}

