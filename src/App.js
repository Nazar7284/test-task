import "./App.css";

function App() {
  let categories = {};

  const Calculate = async () => {
    const response = await fetch(
      "http://test.teaching-me.org/categories/v1/open/categories",
      {
        method: "GET",
        headers: {
          "Accept-Language": "en",
        },
      }
    );
    const data = await response.json(); // Parse the response data
    for (let i = 0; i < data.length; i++) {
      for (let a = 0; a < data[i].childrenCategories.length; a++) {
        categories[data[i].childrenCategories[a].name] = [];
      }
    }
    let page = 0;
    let total = -1;
    while (total !== 0) {
      const response2 = await fetch(
        "http://test.teaching-me.org/categories/v1/open/search",
        {
          method: "POST",
          headers: {
            "Accept-Language": "en",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categories: [5],
            page: page,
            pageSize: 10,
          }),
        }
      );
      const data2 = await response2.json();
      total = data2.teachers.length;
      for (let i = 0; i < data2.teachers.length; i++) {
        for (let a = 0; a < data2.teachers[i].categories.length; a++) {
          categories[data2.teachers[i].categories[a].name].push(
            data2.teachers[i].categories[a].pricePerHour
          );
        }
      }
      page++;
    }
    function average(categories) {
      const averages = {};

      for (const key in categories) {
        if (categories.hasOwnProperty(key) && Array.isArray(categories[key])) {
          const arr = categories[key];
          if (arr.length !== 0) {
            const sum = arr.reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0
            );
            averages[key] = (sum / arr.length).toFixed(1);
          }
        }
      }

      return averages;
    }

    const answer = average(categories);

    for (const key in answer) {
      const response3 = await fetch(
        "http://test.teaching-me.org/categories/v1/open/average-price",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryName: key,
            averagePrice: answer[key],
          }),
        }
      );
      console.log(response3.status);
      console.log(answer);
    }
  };

  return (
    <div className="App">
      <button className="btn-calculate" onClick={Calculate}>
        Calculate average price
      </button>

      <div className="card">
        <div className="details">
          <div>
            <img
              className="icon-message"
              src="https://cdn-icons-png.flaticon.com/128/9068/9068673.png"
              alt="message"
            />
          </div>
          <div className="information">
            <h2>Reguest for the lesson</h2>
            <p>
              Daniel Hamilton wants to start a lesson, please confirm or deny
              the request
            </p>
            <p>18 Dec, 14:50pm, 2022</p>
          </div>
          <div>
            <img
              className="icon-X "
              src="https://cdn-icons-png.flaticon.com/128/1617/1617543.png"
              alt="X"
            />
          </div>
        </div>
        <div className="btn-block">
          <button className="btn-view-details">View Details</button>
          <button className="btn-submit">Submit</button>
        </div>
      </div>
    </div>
  );
}

export default App;
