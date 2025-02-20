<template>
  <div>
    <!-- Hero Section I -->
    <section class="hero-section">
      <h2 class="hero-title">Polyu DID makes it easy</h2>
      <el-row :gutter="20" class="feature-row">
        <!-- Card 1 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="card-icon">
              <i class="el-icon-refresh"></i>
            </div>
            <div class="card-content">
              <h4>Prove once, use forever</h4>
              <p>Users can reuse their credentials in different applications. Reduce friction with best user experience for identity verification.</p>
            </div>
          </el-card>
        </el-col>

        <!-- Card 2 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="card-icon">
              <i class="el-icon-phone"></i>
            </div>
            <div class="card-content">
              <h4>Any device, anywhere</h4>
              <p>With Privado ID Web Wallet, your credentials are accessible across multiple devices using just an authenticator. No downloads, no installations.</p>
            </div>
          </el-card>
        </el-col>

        <!-- Card 3 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="card-icon">
              <i class="el-icon-open"></i>
            </div>
            <div class="card-content">
              <h4>Open Source</h4>
              <p>Privado ID is an open-source project under MIT/Apache licenses. We follow the SSI principles and implement W3C and DIF standards.</p>
            </div>
          </el-card>
        </el-col>

        <!-- Card 4 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="card-icon">
              <i class="el-icon-message"></i>
            </div>
            <div class="card-content">
              <h4>Instant Global Scale</h4>
              <p>Why to choose one credential provider if you can benefit from an entire ecosystem of providers? Choose your trusted providers and accept credentials from all of them.</p>
            </div>
          </el-card>
        </el-col>

        <!-- Card 5 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="card-icon">
              <i class="el-icon-help"></i>
            </div>
            <div class="card-content">
              <h4>All levels of support available</h4>
              <p>By developers, for developers. Navigate our developer portal, use our no-code builders for queries and schemas or reach us through our various support channels.</p>
            </div>
          </el-card>
        </el-col>

        <!-- Card 6 -->
        <el-col :span="8">
          <el-card class="feature-card">
            <div class="card-icon">
              <i class="el-icon-lock"></i>
            </div>
            <div class="card-content">
              <h4>Privacy First, Security Always</h4>
              <p>Perform identity verification without requiring the user to disclose personal data. Minimize your data liability.</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>
    <!-- Section II -->
    <section class="hero-section">
      <h2 class="hero-title">Qualified users only. <br>Get started in minutes.</h2>
      <p class="additional-description">
        Welcome the right people to your app, protocol, or content. <br> Serve your audience and exclude the rest using Privado ID's easy tools.
      </p>
      <el-row :gutter="20" class="feature-row">
        <!-- Card 1 -->
      
          <el-card class="swiper-card">
            <div class="swiper-picture">
                <img src="@/assets/image/kyc.png" alt="KYC Icon" class="card-icon-img" />
            </div>
            <div class="card-content">
              <h4>KYC (Know your Customer)</h4>
              <p>Secure, seamless KYC for effortless compliance and privacy. Verify identity privately, minimize risk.</p>
            </div>
          </el-card>
        <!-- Card 2 -->
          <el-card class="swiper-card">
            <div class="swiper-picture">
                <img src="@/assets/image/human.png" alt="KYC Icon" class="card-icon-img" />
            </div>
            <div class="card-content">
              <h4>Human & Machine Identity</h4>
              <p>Build credible content with tools for sybil resistance.</p>
            </div>
          </el-card>
        <!-- Card 3 -->
        <!-- <swiper-slide>
          <el-card class="swiper-card">
            <div class="swiper-picture">
                <img src="@/assets/image/age.png" alt="KYC Icon" class="card-icon-img" />
            </div>
            <div class="card-content">
              <h4>Age Verification</h4>
              <p>Protect minors, ensure privacy, prevent fraud, and meet regulatory standards seamlessly across digital platforms.</p>
            </div>
          </el-card>
        </swiper-slide> -->

        <!-- Card 4 -->
        <!-- <swiper-slide>
          <el-card class="swiper-card">
            <div class="swiper-picture">
                <img src="@/assets/image/nation.png" alt="KYC Icon" class="card-icon-img" />
            </div>
            <div class="card-content">
              <h4>National ID</h4>
              <p>Digital identities made secure, private, and interoperable for seamless citizen services and global authentication.</p>
            </div>
          </el-card>
        </swiper-slide> -->
      </el-row>
    </section>
    <!-- section III -->
    <section class="middle-section">
      <h2 class="middle-title">What is Privado ID? <br>Get started in minutes.</h2>
      <p class="middle-additional-description">
        Privado ID provides middleware infrastructure and tools for applications that implement privacy-preserving digital identity, empowering users to own their data and share it only with their consent. Applications integrating Privado ID's open-source software benefit from seamless interoperability within a trusted ecosystem, providing their users with a secure, best-in-class experience.
      </p>
      <el-row :gutter="20" class="middle-feature-row">
        <!-- Card 1 -->
          <el-card class="middle-card">
            <div class="middle-picture">
                <img src="@/assets/image/kyc.png" alt="KYC Icon" class="middle-card-icon-img" />
            </div>
            <div class="middle-card-content">
              <h4>Digital identity open-source software and infrastructure</h4>
              <p>A set of open-source software and infrastructure for developers to include privacy-first identity management features into their applications.</p>
            </div>
          </el-card>
      </el-row>
    </section>
    <!-- section IV -->
  <section class="switch-section">  
    <h2 class="switch-title">
      Serve your audience, exclude the rest in two steps</h2>
      <p class="switch-additional-description">
      </p>
    <div class="switch-div">
    <!-- Buttons to switch content -->
      <button 
        :class="{'active': isSelected === 1}" 
        @click="switchTab(1)">
        1. Instant Identity Verification
      </button>
      <button 
        :class="{'active': isSelected === 2}" 
        @click="switchTab(2)">
        2. Reusable Anywhere
      </button>
    <transition name="fade" mode="out-in">
        <!-- Content that will be shown based on the selected button -->
      <div v-if="isSelected === 1" class="verification-container">
        <!-- Left side: Video section -->
        <div class="verification-video">
          <div class="video-frame-container">
            <iframe 
              class="video-frame" 
              src="https://www.youtube.com/embed/xyz" 
              frameborder="0" 
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <!-- Right side: Description section -->
        <div class="verification-description">
          <h2 class="verification-title">1. Instant Identity Verification</h2>
          <p class="verification-text">
            Applications typically request user input directly, but when they need verifiable data, users must obtain that information from a trusted credential provider.
            <br>
          <br> Privado ID seamlessly guides users through credential acquisition, creating an identity wallet instantly if necessary. Verification takes place in-app, and may include Zero Knowledge proofs (generated on the user's device for privacy assurance) and data fields.
          <br>
          <br> User data is securely encrypted in the cloud and decrypted only on their end. Once complete, users return to the application.
          </p>
          
        </div>
      </div>

      <div v-if="isSelected === 2" class="verification-container">
        <!-- Left side: Video section -->
        <div class="verification-video">
          <div class="video-frame-container">
            <iframe 
              class="video-frame" 
              src="https://www.youtube.com/embed/xyz" 
              frameborder="0" 
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <!-- Right side: Description section -->
        <div class="verification-description">
          <h2 class="verification-title">2. Reusable Anywhere</h2>
          <p class="verification-text">
            The User can reuse the credentials obtained and stored in the Privado ID Cloud Wallet in other applications that use Privado ID as a verification mechanism - since there is no need to go through the issuance process again, this is a 2-click experience (authenticate & verify).
          </p>
          
        </div>
      </div>
    </transition>
  </div>
  </section>
  </div>
</template>

<script>


export default {
  name: "HomePage",
  
};
</script>

<style scoped>
/* Hero Section */
.hero-section {
  text-align: left;
  padding: 60px 20px;
}

.hero-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 40px;
  color: #333;
}

/* Feature Cards */
.feature-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.feature-card {
  padding: 0px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: all 0.3s ease;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.feature-card:hover {
  transform: scale(1.05);
}

.card-icon {
  font-size: 24px;
  color: #4caf50;
  /* margin-right: 10px;  Adjust margin between icon and text */
  align-self: flex-start; /* Ensure the icon aligns left */
  display: inline-block; /* Make sure icon is on the same line as text */
}

.card-content {
  /* display: flex; */
  flex-direction: column;
  justify-content: flex-start;
}

.card-content h4 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 5px; /* Reduced margin between h4 and text */
  text-align: center; /* Ensure the title is left-aligned */
}

.card-content p {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  /*width: 300px;  Adjust max-width to ensure text does not go too wide */
  word-wrap: break-word;
  text-align: left;
}

/* Adjust spacing between cards */
.el-col {
  padding: 10px;
}
.additional-description {
  color: #666;
}

/* Adjust swiper-card width for each card to take up 50% of the row */
.swiper-row {
  display: flex;
  flex-wrap: wrap; /* Make sure the items wrap when needed */
  gap: 20px; /* Add some spacing between the cards */
  justify-content: space-between; /* Align the cards evenly */
}

.swiper-card {
  width: 45%; /* Ensure two cards per row */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: all 0.3s ease;
  height: auto; /* Let the height adjust based on content */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Align content at the top */
}

.swiper-card:hover {
  transform: scale(1.05);
}

.swiper-picture {
  display: flex;
  justify-content: center; /* Center the image */
  align-items: center; /* Center the image vertically */
}

/* Adjust icon image size */
.card-icon-img {
  width: 100%; /* Ensure the image takes the full width of the card */
  max-width: 300px; /* Set a max width for the image */
  height: auto; /* Maintain aspect ratio */
  margin-bottom: 10px;
}

/* section III */
.middle-section {
  text-align: center; /* Center the text and content */
  padding: 60px 20px; /* Add padding to the section */
  background-color: #f9f9f9; /* Optional: Add background color for better visibility */
}

.middle-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #333; /* Darker color for the title */
}

.middle-additional-description {
  max-width: 500px; /* Limit the maximum width */
  color: #666; /* Set the font color to #666 */
  font-size: 16px; /* Adjust font size */
  line-height: 1.5; /* Adjust line-height for readability */
  margin: 0 auto; /* Center the text block horizontally */
  text-align: center; /* Ensure the text inside is centered */
  margin-bottom: 40px; /* Add margin to separate the text from the cards */
}

/* Styling for the middle feature row (card container) */
.middle-feature-row {
  display: flex;
  justify-content: center; /* Center the card within the row */
  flex-wrap: wrap; /* Ensure cards wrap on smaller screens */
  gap: 20px; /* Add space between the cards */
}

/* Card styles */
.middle-card {
  width: 600px; /* Set the card width */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Align the content to the top */
}

.middle-card:hover {
  transform: scale(1.05); /* Slight zoom effect on hover */
}

.middle-picture {
  display: flex;
  justify-content: center; /* Center the image inside the card */
  align-items: center; /* Center the image vertically */
  margin-bottom: 10px; /* Add space between the image and text */
}

.middle-card-icon-img {
  width: 100%; /* Ensure the image takes the full width of the card */
  max-width: 450px; /* Optional: Set a max width to ensure the image doesn’t stretch too much */
  height: auto; /* Maintain the aspect ratio of the image */
}
.middle-card-content h4 {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 5px; /* Reduced margin between h4 and text */
  text-align: left; /* Ensure the title is left-aligned */
}

.middle-card-content p {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
  /*width: 300px;  Adjust max-width to ensure text does not go too wide */
  word-wrap: break-word;
  text-align: left;
}

/* section IV */
.switch-section {
  text-align: center; /* Center the text and content */
  padding: 60px 20px; /* Add padding to the section */
  background-color: #f9f9f9; /* Optional: Add background color for better visibility */
}

.switch-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 30px;
  color: #333; /* Darker color for the title */
}

.switch-additional-description {
  max-width: 500px; /* Limit the maximum width */
  color: #666; /* Set the font color to #666 */
  font-size: 16px; /* Adjust font size */
  line-height: 1.5; /* Adjust line-height for readability */
  margin: 0 auto; /* Center the text block horizontally */
  text-align: center; /* Ensure the text inside is centered */
  margin-bottom: 40px; /* Add margin to separate the text from the cards */
}
.switch-div button {
  background: none;
  border: none;
  font-size: 18px;
  padding: 10px 20px;
  color: #B0B0B0; /* Default grey color */
  border-bottom: 2px solid transparent; /* Transparent bottom border */
  cursor: pointer;
  transition: all 0.1s ease;
}

.switch-div button.active {
  color: black; /* Black text when selected */
  font-weight: bold; /* Bold when selected */
  border-bottom: 2px solid #4CAF50; /* Green bottom border when selected */
}

.switch-div button:hover {
  opacity: 0.8; /* Slight opacity when hovering */
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease-in-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
/* div 1 */
.verification-container {
  padding: 60px 20px;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.verification-video {
  width: 45%; /* Video section takes up 45% of the space */
  border: 5px solid #4CAF50; /* Green border around the video */
  border-radius: 10px;
  padding: 10px;
}

.video-frame-container {
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
}

.video-frame {
  width: 100%;
  height: 400px; /* Fixed height for the video */
}

.verification-description {
  width: 50%; /* Description section takes up 50% */
  text-align: left;
}

.verification-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.verification-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px;
}



/* Responsive */
@media (max-width: 768px) {
  .feature-card {
    height: auto;
  }
  .feature-row {
    flex-direction: column;
  }
  .middle-card {
    width: 100%; /* Ensure cards take full width on small screens */
  }
  .middle-feature-row {
    flex-direction: column; /* Stack the cards vertically on smaller screens */
  }
  .verification-video, .verification-description {
    width: 100%;
  }

  .video-frame {
    height: 200px; /* Adjust video height for small screens */
  }
}
</style>
<script>
export default {
  data() {
    return {
      isSelected: 1, // Default selected tab
    };
  },
  methods: {
    switchTab(tab) {
      this.isSelected = tab;
    }
  }
};
</script>