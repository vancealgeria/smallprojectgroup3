
<?php


	$inData = getRequestInfo();
	
	$TempID = 0;
	$ID = 0;
	$FirstName = "";
	$LastName = "";
	$Phone = "";
	$Email = "";
	$UserID = 0;
	$searchCount = 0;
	

	$conn = new mysqli("127.0.0.1", "Postman", "ThisIsAPI!", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("WITH RankedColors AS (SELECT ROW_NUMBER() OVER (ORDER BY FirstName) AS TempID,ID,FirstName,LastName,Phone,Email,UserID FROM Contacts WHERE UserID = ? AND (FirstName LIKE ? OR LastName LIKE ? OR Phone LIKE ? OR Email LIKE ?)) SELECT * FROM RankedColors WHERE TempID BETWEEN ? AND ?");
		$search = "%" . $inData["search"] . "%";
		$stmt->bind_param("issssii", $inData["userID"], $search, $search, $search, $search, $inData["apiSearchLowerBound"], $inData["apiSearchUpperBound"]);
		$stmt->execute();
		$result = $stmt->get_result();



		while ($row = $result->fetch_assoc()) {
        	$resultsArray[] = array(
            	"ID" => $row["ID"],
            	"FirstName" => $row["FirstName"],
            	"LastName" => $row["LastName"],
            	"Phone" => $row["Phone"],
            	"Email" => $row["Email"],
        	);
        	$searchCount++;
    	}

		if ($searchCount == 0) {
        	returnWithError("No Records Found");
    	} else {
        	returnWithInfo($resultsArray);
    	}

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo($searchResultsArray) {
    	$retValue = json_encode(array("results" => $searchResultsArray, "error" => ""));
    	sendResultInfoAsJson($retValue);
	}
	
?>
